import { useState, useEffect, useRef } from 'react';
import { Star, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
} from 'firebase/auth';
import { db, auth } from './firebase';
import './Reviews.css';

const PENDING_REVIEW_KEY = 'bakeybakey_pendingReview';
const EMAIL_FOR_SIGNIN_KEY = 'bakeybakey_reviewEmail';

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);

function confirmationEmailErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid — please double-check it.';
    case 'auth/operation-not-allowed':
      return 'Review confirmations are not configured yet. Please enable Email link (passwordless sign-in) in Firebase Authentication.';
    case 'auth/unauthorized-continue-uri':
      return `Review confirmations are not configured for ${window.location.hostname}. Please add this domain to Firebase Authentication → Settings → Authorized domains.`;
    case 'auth/invalid-continue-uri':
      return 'The review confirmation return address is invalid. Please contact us and include error auth/invalid-continue-uri.';
    case 'auth/network-request-failed':
      return 'We could not reach the email service. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many confirmation emails were requested. Please wait a few minutes and try again.';
    case 'auth/quota-exceeded':
      return 'Firebase has temporarily limited confirmation emails for this project. This can include earlier tests, retries, other visitors, or abuse protection—not just this attempt. Please try again later, or contact the site owner to increase the Firebase quota.';
    default:
      return error?.code
        ? `Something went wrong sending your confirmation email. Please try again. (${error.code})`
        : 'Something went wrong sending your confirmation email. Please try again.';
  }
}

// Common domain typos -> the domain the visitor probably meant.
// Doesn't guarantee deliverability, but catches the vast majority of
// real-world mistakes (wrong TLD, missing letter, transposed letters).
const KNOWN_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'msn.com',
  'comcast.net',
  'protonmail.com',
];

const DOMAIN_TYPO_FIXES = {
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'gmail.con': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'yahoo.con': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmail.con': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'iclould.com': 'icloud.com',
  'icoud.com': 'icloud.com',
};

// Cheap edit-distance check so we also catch typos not in the fixed list
// above (e.g. a single swapped/dropped letter in an otherwise-known domain).
function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [
    i,
    ...Array(b.length).fill(0),
  ]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function suggestEmailCorrection(email) {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1) return null;

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  if (!domain) return null;

  if (DOMAIN_TYPO_FIXES[domain]) {
    return `${local}@${DOMAIN_TYPO_FIXES[domain]}`;
  }

  // Only suggest a close match, and only if it's not already correct.
  let closest = null;
  let closestDistance = Infinity;
  for (const known of KNOWN_DOMAINS) {
    if (domain === known) return null;
    const distance = levenshtein(domain, known);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = known;
    }
  }

  // Distance of 1-2 on a short domain is almost certainly a typo;
  // anything further is more likely a legitimately different provider.
  if (closest && closestDistance > 0 && closestDistance <= 2) {
    return `${local}@${closest}`;
  }
  return null;
}

function StarRating({ value, onChange, size = 22, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`star-button ${readOnly ? 'star-readonly' : ''}`}
          disabled={readOnly}
          onClick={() => onChange && onChange(n)}
          onMouseEnter={() => !readOnly && setHovered(n)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          aria-pressed={value === n}
        >
          <Star
            size={size}
            fill={active >= n ? 'var(--mango)' : 'none'}
            color={active >= n ? 'var(--mango)' : 'var(--line)'}
          />
        </button>
      ))}
    </div>
  );
}

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    rating: 0,
    text: '',
    email: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [statusMessage, setStatusMessage] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', text }
  const [pendingPreview, setPendingPreview] = useState(null);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const signInAttempted = useRef(false);

  const [reviewsError, setReviewsError] = useState(null);

  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(30)
      );
      const snap = await withTimeout(getDocs(q), 15000);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setReviewsError(null);
    } catch (err) {
      // Surface this instead of failing silently — a permission-denied
      // error here almost always means the Firestore security rules
      // published in the Firebase Console don't match this app's
      // expectations (e.g. still the old rules, or never published).
      console.error('Could not load reviews', err);
      setReviewsError(
        err?.message === 'timeout'
          ? "Reviews couldn't be loaded — the connection to Firebase timed out. Please check your connection and refresh."
          : err?.code === 'permission-denied'
          ? "Reviews couldn't be loaded (permission denied) — this usually means the Firestore security rules haven't been published yet."
          : "Reviews couldn't be loaded right now. Please refresh in a moment."
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // If the visitor arrived here by clicking the confirmation link in their
  // email, finish signing them in and publish their pending review.
  useEffect(() => {
    const completeSignIn = async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) return;

      // Guard against React StrictMode's dev-mode double-invoke (and any
      // other double-fire of this effect) consuming the single-use sign-in
      // link twice, which would otherwise surface a false
      // "link expired" error on the very first legitimate click.
      if (signInAttempted.current) return;
      signInAttempted.current = true;

      // Capture the link before touching the URL, then immediately strip
      // the oobCode/apiKey query params from the address bar. Sign-in
      // links are single-use — if we wait until the very end (in a
      // `finally`) to clean the URL, a slow or hung request means the
      // spent code is still sitting in the URL, and a refresh mid-flight
      // re-submits that dead code, producing a false "link expired" error.
      const signInLink = window.location.href;
      const cleanUrl = () => {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.pathname + url.hash);
      };
      cleanUrl();

      let email = window.localStorage.getItem(EMAIL_FOR_SIGNIN_KEY);
      if (!email) {
        email = window.prompt(
          'Please confirm the email you used to write your review:'
        );
      }
      if (!email) return;

      setVerifying(true);

      try {
        const result = await withTimeout(
          signInWithEmailLink(auth, email, signInLink),
          20000
        );
        const pendingRaw = window.localStorage.getItem(PENDING_REVIEW_KEY);
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

        if (pending) {
          await withTimeout(
            addDoc(collection(db, 'reviews'), {
              name: pending.name,
              rating: pending.rating,
              text: pending.text,
              email: result.user.email,
              createdAt: serverTimestamp(),
            }),
            20000
          );
          setBanner({
            type: 'success',
            text: 'Thanks! Your review is now live below.',
          });
          setPendingPreview(null);
          await fetchReviews();
        } else {
          setBanner({
            type: 'error',
            text: "You're verified, but we couldn't find your draft review — please write it again below.",
          });
        }

        window.localStorage.removeItem(PENDING_REVIEW_KEY);
        window.localStorage.removeItem(EMAIL_FOR_SIGNIN_KEY);
        await signOut(auth);
      } catch (err) {
        console.error(err);
        setBanner({
          type: 'error',
          text:
            err?.message === 'timeout'
              ? "That took too long to confirm — your review may not have been saved. Please check below, and try again if you don't see it."
              : "That confirmation link didn't work — it may have expired. Please try writing your review again.",
        });
      } finally {
        setVerifying(false);
      }
    };

    completeSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'email') setEmailSuggestion(null);
  };

  const handleEmailBlur = () => {
    if (!form.email.trim()) {
      setEmailSuggestion(null);
      return;
    }
    setEmailSuggestion(suggestEmailCorrection(form.email));
  };

  const applyEmailSuggestion = () => {
    if (!emailSuggestion) return;
    setForm((prev) => ({ ...prev, email: emailSuggestion }));
    setEmailSuggestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.text.trim() ||
      !form.rating ||
      !form.email.trim()
    ) {
      setStatus('error');
      setStatusMessage(
        'Please fill in your name, a rating, your review, and your email.'
      );
      return;
    }

    // If there's an unresolved likely-typo suggestion, block submission
    // and ask the visitor to confirm/fix it rather than silently "sending"
    // to an address that probably doesn't exist.
    const suggestion = suggestEmailCorrection(form.email);
    if (suggestion) {
      setEmailSuggestion(suggestion);
      setStatus('error');
      setStatusMessage(
        'Please double-check your email address before sending.'
      );
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    try {
      const actionCodeSettings = {
        url: `${window.location.origin}${window.location.pathname}?verifyReview=1`,
        handleCodeInApp: true,
      };

      window.localStorage.setItem(
        PENDING_REVIEW_KEY,
        JSON.stringify({
          name: form.name.trim(),
          rating: form.rating,
          text: form.text.trim(),
        })
      );
      window.localStorage.setItem(EMAIL_FOR_SIGNIN_KEY, form.email.trim());

      await sendSignInLinkToEmail(auth, form.email.trim(), actionCodeSettings);

      setPendingPreview({
        name: form.name.trim(),
        rating: form.rating,
        text: form.text.trim(),
        email: form.email.trim(),
      });
      setShowVerificationNotice(true);
      setStatus('sent');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setStatusMessage(confirmationEmailErrorMessage(err));
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : null;

  return (
    <section id="reviews" className="reviews">
      <div className="section-container">
        <div className="reviews-header">
          <span className="section-label">From Real Visitors</span>
          <h2 className="section-title">Reviews</h2>
          <p className="section-subtitle">
            Every review here comes from a visitor who confirmed their email.
          </p>
          {averageRating && (
            <div className="reviews-average">
              <StarRating
                value={Math.round(averageRating)}
                readOnly
                size={20}
              />
              <span>
                {averageRating.toFixed(1)} average · {reviews.length} review
                {reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>

        {verifying && (
          <div className="reviews-banner reviews-banner-success">
            <Loader2 size={20} className="spin" />
            <span>Confirming your review...</span>
          </div>
        )}

        {banner && !verifying && (
          <div className={`reviews-banner reviews-banner-${banner.type}`}>
            {banner.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{banner.text}</span>
          </div>
        )}

        {showVerificationNotice && pendingPreview && (
          <div className="verification-modal" role="dialog" aria-modal="true" aria-labelledby="verification-title">
            <button
              type="button"
              className="verification-modal-backdrop"
              aria-label="Dismiss verification notice"
              onClick={() => setShowVerificationNotice(false)}
            />
            <div className="verification-modal-card">
              <div className="verification-modal-icon"><Mail size={24} /></div>
              <h3 id="verification-title">Your review is ready!</h3>
              <p>
                We sent a verification link to <strong>{pendingPreview.email}</strong>.
                Your review will only stay on Bakey Bakey after you verify your email.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowVerificationNotice(false)}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {!formOpen && (
          <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
            Write a Review
          </button>
        )}

        {formOpen && (
          <form className="review-form" onSubmit={handleSubmit}>
            {status !== 'sent' ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="review-name">Your Name *</label>
                    <input
                      id="review-name"
                      type="text"
                      value={form.name}
                      onChange={handleFieldChange('name')}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="review-email">Email *</label>
                    <input
                      id="review-email"
                      type="email"
                      value={form.email}
                      onChange={handleFieldChange('email')}
                      onBlur={handleEmailBlur}
                      placeholder="your@email.com"
                      required
                    />
                    {emailSuggestion && (
                      <p className="small-text email-suggestion">
                        Did you mean{' '}
                        <button
                          type="button"
                          className="email-suggestion-link"
                          onClick={applyEmailSuggestion}
                        >
                          {emailSuggestion}
                        </button>
                        ?
                      </p>
                    )}
                    <p className="small-text">
                      We'll email you a link to confirm it's really you before
                      your review goes live.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Rating *</label>
                  <StarRating
                    value={form.rating}
                    onChange={(n) =>
                      setForm((prev) => ({ ...prev, rating: n }))
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-text">Your Review *</label>
                  <textarea
                    id="review-text"
                    value={form.text}
                    onChange={handleFieldChange('text')}
                    rows="4"
                    placeholder="Tell us what you thought..."
                    required
                  />
                </div>

                {status === 'error' && (
                  <div className="form-message error">{statusMessage}</div>
                )}

                <div className="review-form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={18} className="spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={18} /> Send Confirmation Email
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setFormOpen(false);
                      setStatus('idle');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="form-message success">
                <strong>Check your inbox!</strong> We sent a confirmation link
                to {form.email}. Click it to publish your review — you can close
                this tab.
              </div>
            )}
          </form>
        )}

        <div className="reviews-list">
          {loadingReviews && (
            <p className="reviews-loading">Loading reviews...</p>
          )}
          {reviewsError && !loadingReviews && (
            <p className="reviews-empty reviews-load-error">{reviewsError}</p>
          )}
          {!loadingReviews && !reviewsError && reviews.length === 0 && !pendingPreview && (
            <p className="reviews-empty">
              No visitor reviews yet — be the first!
            </p>
          )}
          {pendingPreview && (
            <div className="review-card review-card-pending">
              <div className="pending-review-label">Pending email verification</div>
              <StarRating value={pendingPreview.rating} readOnly size={16} />
              <p className="review-text">{pendingPreview.text}</p>
              <div className="review-author">
                <strong>{pendingPreview.name}</strong>
                <span>Not published yet</span>
              </div>
            </div>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <StarRating value={review.rating} readOnly size={16} />
              <p className="review-text">{review.text}</p>
              <div className="review-author">
                <strong>{review.name}</strong>
                {review.createdAt?.seconds && (
                  <span>
                    {new Date(
                      review.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
