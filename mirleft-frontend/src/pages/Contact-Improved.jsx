import { useState } from "react";
import { contactService } from "../services/services";
import { useTranslation } from "react-i18next";

const COLORS = {
  sand: '#f5ece0',
  gold: '#113611',
  goldDark: '#123b1e',
  brown: '#153526',
  brownLight: 'rgba(34,128,75,0.4)',
  brownFaint: 'rgba(35,126,59,0.3)',
  cream: '#fdf3e3',
  taupe: '#152d23',
};

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await contactService.send(formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.sand, fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500&display=swap');
      `}</style>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.brown} 100%)`,
        padding: '6rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '3.5rem',
            fontWeight: 600,
            color: COLORS.cream,
            marginBottom: '1rem',
          }}>
            {i18n.language === 'en' ? 'Get in Touch' : (i18n.language === 'fr' ? 'Contactez-nous' : 'تواصل معنا')}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: COLORS.sand,
            opacity: 0.9,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 300,
          }}>
            {i18n.language === 'en' ? 'Discover Mirleft and plan your perfect getaway with us' : (i18n.language === 'fr' ? 'Découvrez Mirleft et planifiez votre escapade parfaite avec nous' : 'اكتشف ميرلف وخطط لقضاء إجازتك المثالية معنا')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr',
          gap: '2rem',
        }}>
          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: COLORS.cream,
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(61,42,15,0.08)',
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.5rem',
                fontWeight: 600,
                color: COLORS.brown,
                marginBottom: '1.5rem',
              }}>
                {i18n.language === 'en' ? 'Contact Information' : (i18n.language === 'fr' ? 'Informations de contact' : 'معلومات الاتصال')}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brownLight,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.address')}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: COLORS.brown,
                    margin: 0,
                  }}>
                    {t('contact.mirleftLocation')}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: COLORS.brownLight,
                    marginTop: '0.25rem',
                    margin: 0,
                  }}>
                    {t('contact.atlanticCoast')}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brownLight,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.phone')}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: COLORS.brown,
                    margin: 0,
                  }}>
                    +212 528-861-611
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: COLORS.brownLight,
                    marginTop: '0.25rem',
                    margin: 0,
                  }}>
                    {t('contact.available247')}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brownLight,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.email')}
                  </h4>
                  <p style={{
                    fontSize: '1rem',
                    color: COLORS.brown,
                    margin: 0,
                  }}>
                    info@mirleft.com
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: COLORS.brownLight,
                    marginTop: '0.25rem',
                    margin: 0,
                  }}>
                    {t('contact.replyWithin24h')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{
            background: COLORS.cream,
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(61,42,15,0.08)',
          }}>
            {success && (
              <div style={{
                padding: '1rem',
                background: 'rgba(34,128,75,0.1)',
                color: COLORS.gold,
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}>
                {t('contact.success')}
              </div>
            )}

            {error && (
              <div style={{
                padding: '1rem',
                background: 'rgba(220,38,38,0.1)',
                color: '#dc2626',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brown,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.name')}
                  </label>
                  <div style={{
                    borderBottom: `1px solid ${COLORS.brownLight}`,
                    padding: '0.5rem 0',
                  }}>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.namePlaceholder')}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '1rem',
                        color: COLORS.brown,
                        fontWeight: 300,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brown,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.emailLabel')}
                  </label>
                  <div style={{
                    borderBottom: `1px solid ${COLORS.brownLight}`,
                    padding: '0.5rem 0',
                  }}>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.emailPlaceholder')}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '1rem',
                        color: COLORS.brown,
                        fontWeight: 300,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brown,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.phoneLabel')}
                  </label>
                  <div style={{
                    borderBottom: `1px solid ${COLORS.brownLight}`,
                    padding: '0.5rem 0',
                  }}>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+212 6XX XXX XXX"
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '1rem',
                        color: COLORS.brown,
                        fontWeight: 300,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brown,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.subject')}
                  </label>
                  <div style={{
                    borderBottom: `1px solid ${COLORS.brownLight}`,
                    padding: '0.5rem 0',
                  }}>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.subjectPlaceholder')}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: '1rem',
                        color: COLORS.brown,
                        fontWeight: 300,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: COLORS.brown,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}>
                    {t('contact.message')}
                  </label>
                  <div style={{
                    borderBottom: `1px solid ${COLORS.brownLight}`,
                    padding: '0.5rem 0',
                  }}>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.messagePlaceholder')}
                    rows="5"
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '1rem',
                      color: COLORS.brown,
                      fontWeight: 300,
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '1rem 2.5rem',
                  background: COLORS.gold,
                  color: COLORS.cream,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'background 0.2s',
                  marginTop: '0.5rem',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? t('contact.sending') : t('contact.sendMessage')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
