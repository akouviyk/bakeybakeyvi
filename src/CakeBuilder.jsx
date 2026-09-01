import { useState, useMemo } from 'react';
import { Cake, Sparkles, ArrowRight } from 'lucide-react';
import './CakeBuilder.css';

const BASES = [
  { id: 'coconut-vanilla', name: 'Coconut Vanilla', swatch: '#FFF6E8' },
  { id: 'guava-red-velvet', name: 'Guava Red Velvet', swatch: '#E8425A' },
  { id: 'chocolate-rum', name: 'Chocolate Rum', swatch: '#4A2C1D' },
  { id: 'mango-turmeric', name: 'Mango Turmeric', swatch: '#F5A729' },
];

const FILLINGS = [
  { id: 'passionfruit-curd', name: 'Passionfruit Curd', swatch: '#F2C230' },
  { id: 'pineapple-compote', name: 'Pineapple Compote', swatch: '#FFDD57' },
  { id: 'chocolate-ganache', name: 'Chocolate Ganache', swatch: '#3B2418' },
  { id: 'coconut-cream', name: 'Coconut Cream', swatch: '#FBF3E4' },
];

const FROSTINGS = [
  { id: 'vegan-buttercream', name: 'Vegan Buttercream', swatch: '#FFF7EC' },
  { id: 'coconut-whip', name: 'Toasted Coconut Whip', swatch: '#EDD9B0' },
  { id: 'chocolate-ganache-f', name: 'Chocolate Ganache', swatch: '#3B2418' },
  { id: 'hibiscus-glaze', name: 'Hibiscus Glaze', swatch: '#FF6F91' },
];

const OCCASIONS = [
  'Birthday',
  'Wedding',
  'Just Because',
  'Café / Wholesale Order',
];

function Swatch({ item, selected, onSelect, groupLabel }) {
  return (
    <button
      type="button"
      className={`swatch ${selected ? 'swatch-selected' : ''}`}
      style={{ '--swatch-color': item.swatch }}
      onClick={() => onSelect(item)}
      aria-pressed={selected}
      aria-label={`${groupLabel}: ${item.name}`}
    >
      <span className="swatch-chip" />
      <span className="swatch-label">{item.name}</span>
    </button>
  );
}

function CakeBuilder({ onSendToOrder }) {
  const [base, setBase] = useState(BASES[0]);
  const [filling, setFilling] = useState(FILLINGS[0]);
  const [frosting, setFrosting] = useState(FROSTINGS[0]);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [sent, setSent] = useState(false);

  const ticketLines = useMemo(
    () => [
      { label: 'Cake', value: base.name },
      { label: 'Filling', value: filling.name },
      { label: 'Frosting', value: frosting.name },
      { label: 'Occasion', value: occasion },
    ],
    [base, filling, frosting, occasion]
  );

  const handleSend = () => {
    const message = `Custom cake request built on the site:\n- Cake: ${base.name}\n- Filling: ${filling.name}\n- Frosting: ${frosting.name}\n- Occasion: ${occasion}\n\n(Tell us your size, serving count, and design ideas here!)`;
    onSendToOrder(message);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="build-a-cake" className="cake-builder">
      <div className="section-container">
        <div className="cake-builder-header">
          <span className="eyebrow eyebrow-mango">
            <Sparkles size={16} /> Design Your Own
          </span>
          <h2 className="section-title">Build Your Cake</h2>
          <p className="section-subtitle">
            Mix and match island flavors like you're standing at the counter.
            Pick your combo below and we'll turn it into a real quote — no
            guesswork required.
          </p>
        </div>

        <div className="cake-builder-grid">
          <div className="cake-builder-picks">
            <div className="pick-group">
              <h3 className="pick-group-title">1. Choose your cake</h3>
              <div className="swatch-row">
                {BASES.map((item) => (
                  <Swatch
                    key={item.id}
                    item={item}
                    selected={base.id === item.id}
                    onSelect={setBase}
                    groupLabel="Cake"
                  />
                ))}
              </div>
            </div>

            <div className="pick-group">
              <h3 className="pick-group-title">2. Pick a filling</h3>
              <div className="swatch-row">
                {FILLINGS.map((item) => (
                  <Swatch
                    key={item.id}
                    item={item}
                    selected={filling.id === item.id}
                    onSelect={setFilling}
                    groupLabel="Filling"
                  />
                ))}
              </div>
            </div>

            <div className="pick-group">
              <h3 className="pick-group-title">3. Finish it off</h3>
              <div className="swatch-row">
                {FROSTINGS.map((item) => (
                  <Swatch
                    key={item.id}
                    item={item}
                    selected={frosting.id === item.id}
                    onSelect={setFrosting}
                    groupLabel="Frosting"
                  />
                ))}
              </div>
            </div>

            <div className="pick-group">
              <h3 className="pick-group-title">4. What's the occasion?</h3>
              <div className="chip-row">
                {OCCASIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`occasion-chip ${occasion === item ? 'occasion-chip-active' : ''}`}
                    onClick={() => setOccasion(item)}
                    aria-pressed={occasion === item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="order-ticket" role="status">
            <div className="order-ticket-notch" aria-hidden="true" />
            <div className="order-ticket-header">
              <Cake size={20} />
              <span>Bakey Bakey VI — Order Ticket</span>
            </div>
            <div className="order-ticket-body">
              {ticketLines.map((line) => (
                <div className="order-ticket-line" key={line.label}>
                  <span>{line.label}</span>
                  <span>{line.value}</span>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary ticket-cta" onClick={handleSend}>
              Send This to the Bakery
              <ArrowRight size={18} />
            </button>
            {sent && (
              <p className="ticket-sent-note">
                Added to your order form below — just add your details!
              </p>
            )}
            <p className="order-ticket-footer">
              Custom cakes start at $45 · 3–5 days notice · pickup at Northside Grind, St. Thomas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CakeBuilder;
