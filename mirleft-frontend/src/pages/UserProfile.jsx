import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authService, bookingService, favoriteService } from '../services/services'
import { getImageUrl } from '../utils/images'
import { formatPriceDH } from '../utils/format'

const COLORS = {
  sand: '#f5ece0',
  gold: '#113611',
  goldDark: '#123b1e',
  brown: '#153526',
  brownLight: 'rgba(34, 128, 75, 0.4)',
  brownFaint: 'rgba(35, 126, 59, 0.3)',
  cream: '#fdf3e3',
  taupe: '#152d23',
  goldBorder: 'rgba(12, 62, 25, 0.4)',
}

export default function UserProfile() {
  const { t, i18n } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState({
    properties: [],
    restaurants: [],
    activities: [],
  })
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [profileStatus, setProfileStatus] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      password_confirmation: '',
    })
    fetchFavorites()
  }, [user])

  const fetchFavorites = async () => {
    try {
      const response = await favoriteService.getAll()
      setFavorites(response.data)
    } catch (error) {
      console.error('Failed to fetch favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (id, type) => {
    await favoriteService.toggle({
      favorable_id: id,
      favorable_type: type,
    })
    fetchFavorites()
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileStatus('Saving...')
    try {
      // In a real app, you would call auth service to update profile
      // For now just show success
      setProfileStatus('Profile updated successfully!')
      setTimeout(() => setProfileStatus(''), 3000)
    } catch (error) {
      setProfileStatus('Error updating profile')
    }
  }

  const totalFavorites =
    (favorites.properties?.length || 0) +
    (favorites.restaurants?.length || 0) +
    (favorites.activities?.length || 0) +
    (favorites.destinations?.length || 0)

  return (
    <div style={{ minHeight: '100vh', background: COLORS.sand, fontFamily: "'Jost', sans-serif", padding: '2rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400;500&display=swap');
        .ml-field-inner:focus-within { border-bottom-color: ${COLORS.gold} !important; }
      `}</style>

      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.brown} 100%)`, 
          padding: '2rem', 
          borderRadius: 16, 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: COLORS.cream, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 32,
              color: COLORS.gold,
              border: `3px solid ${COLORS.cream}`
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ 
                fontFamily: "'Cormorant Garamond', serif", 
                fontSize: 28, 
                fontWeight: 600, 
                color: COLORS.cream,
                margin: 0,
                marginBottom: '0.3rem'
              }}>
                {user?.name || 'User'}
              </h1>
              <p style={{ fontSize: 14, color: COLORS.sand, margin: 0, opacity: 0.9 }}>
                {user?.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            style={{
              padding: '10px 24px',
              background: COLORS.cream,
              color: COLORS.gold,
              border: 'none',
              borderRadius: 4,
              fontFamily: "'Jost', sans-serif",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {t('navbar.logout')}
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: `1px solid ${COLORS.brownLight}`,
          paddingBottom: '1rem'
        }}>
          {[
            { id: 'profile', label: i18n.language === 'en' ? 'Profile Settings' : (i18n.language === 'fr' ? 'Paramètres du profil' : 'إعدادات الملف الشخصي') },
            { id: 'favorites', label: t('navbar.favorites') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: 12,
                fontFamily: "'Jost', sans-serif",
                fontWeight: 500,
                letterSpacing: '0.1em',
                color: activeTab === tab.id ? COLORS.gold : COLORS.brownLight,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1rem',
                paddingBottom: '1.5rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div style={{
            background: COLORS.cream,
            borderRadius: 16,
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
          }}>
            <h3 style={{ 
              fontFamily: "'Cormorant Garamond', serif", 
              fontSize: 24, 
              fontWeight: 600, 
              color: COLORS.brown,
              margin: 0,
              marginBottom: '1.5rem'
            }}>
              {i18n.language === 'en' ? 'Profile Settings' : (i18n.language === 'fr' ? 'Paramètres du profil' : 'إعدادات الملف الشخصي')}
            </h3>

            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 11, 
                  fontWeight: 500, 
                  color: COLORS.brown, 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  {t('auth.fullName')}
                </label>
                <div style={{ borderBottom: `1px solid ${COLORS.brownLight}`, padding: '8px 0' }}>
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: COLORS.brown
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 11, 
                  fontWeight: 500, 
                  color: COLORS.brown, 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  {t('auth.email')}
                </label>
                <div style={{ borderBottom: `1px solid ${COLORS.brownLight}`, padding: '8px 0' }}>
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    type="email"
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: COLORS.brown
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: 11, 
                  fontWeight: 500, 
                  color: COLORS.brown, 
                  letterSpacing: '0.1em', 
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem'
                }}>
                  {i18n.language === 'en' ? 'New Password (leave empty to keep current)' : (i18n.language === 'fr' ? 'Nouveau mot de passe (laisser vide pour conserver le mot de passe actuel)' : 'كلمة المرور الجديدة (اتركها فارغة للاحتفاظ بالحالية)')}
                </label>
                <div style={{ borderBottom: `1px solid ${COLORS.brownLight}`, padding: '8px 0' }}>
                  <input
                    value={profileForm.password}
                    onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                    type="password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: COLORS.brown
                    }}
                  />
                </div>
              </div>

              {profileForm.password && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: 11, 
                    fontWeight: 500, 
                    color: COLORS.brown, 
                    letterSpacing: '0.1em', 
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem'
                  }}>
                    {t('auth.confirmPassword')}
                  </label>
                  <div style={{ borderBottom: `1px solid ${COLORS.brownLight}`, padding: '8px 0' }}>
                    <input
                      value={profileForm.password_confirmation}
                      onChange={(e) => setProfileForm({ ...profileForm, password_confirmation: e.target.value })}
                      type="password"
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 14,
                        color: COLORS.brown
                      }}
                    />
                  </div>
                </div>
              )}

              {profileStatus && (
                <p style={{ fontSize: 13, color: profileStatus.includes('successfully') ? COLORS.gold : '#c0392b', margin: 0 }}>
                  {profileStatus === 'Saving...' ? (i18n.language === 'en' ? 'Saving...' : (i18n.language === 'fr' ? 'Enregistrement...' : 'جارٍ الحفظ...')) : 
                   profileStatus === 'Profile updated successfully!' ? (i18n.language === 'en' ? 'Profile updated successfully!' : (i18n.language === 'fr' ? 'Profil mis à jour avec succès!' : 'تم تحديث الملف الشخصي بنجاح!')) : 
                   (i18n.language === 'en' ? 'Error updating profile' : (i18n.language === 'fr' ? 'Erreur lors de la mise à jour du profil' : 'خطأ في تحديث الملف الشخصي'))}
                </p>
              )}

              <button
                type="submit"
                style={{
                  padding: '14px 32px',
                  background: COLORS.gold,
                  color: COLORS.cream,
                  border: 'none',
                  borderRadius: 8,
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  alignSelf: 'flex-start'
                }}
              >
                {i18n.language === 'en' ? 'Save Changes' : (i18n.language === 'fr' ? 'Enregistrer les modifications' : 'حفظ التغييرات')}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: COLORS.brownLight }}>
                {t('common.loading')}
              </div>
            ) : totalFavorites === 0 ? (
              <div style={{ 
                background: COLORS.cream, 
                borderRadius: 16, 
                padding: '3rem', 
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
              }}>
                <p style={{ fontSize: 16, color: COLORS.brownLight, margin: 0 }}>
                  {i18n.language === 'en' ? 'No favorites yet.' : (i18n.language === 'fr' ? 'Pas encore de favoris.' : 'لا توجد مفضلات بعد.')}
                </p>
              </div>) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {favorites.properties && favorites.properties.length > 0 && (
                  <div style={{
                    background: COLORS.cream,
                    borderRadius: 16,
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
                  }}>
                    <h3 style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: 22, 
                      fontWeight: 600, 
                      color: COLORS.brown,
                      margin: 0,
                      marginBottom: '1.5rem'
                    }}>
                      {t('navbar.hotels')}
                    </h3>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {favorites.properties.map((item) => (
                        <FavoriteCard key={item.id} item={item} type="App\\Models\\Property" onRemove={removeFavorite} />
                      ))}
                    </div>
                  </div>
                )}

                {favorites.restaurants && favorites.restaurants.length > 0 && (
                  <div style={{
                    background: COLORS.cream,
                    borderRadius: 16,
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
                  }}>
                    <h3 style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: 22, 
                      fontWeight: 600, 
                      color: COLORS.brown,
                      margin: 0,
                      marginBottom: '1.5rem'
                    }}>
                      {t('navbar.restaurants')}
                    </h3>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {favorites.restaurants.map((item) => (
                        <FavoriteCard key={item.id} item={item} type="App\\Models\\Restaurant" onRemove={removeFavorite} />
                      ))}
                    </div>
                  </div>
                )}

                {favorites.activities && favorites.activities.length > 0 && (
                  <div style={{
                    background: COLORS.cream,
                    borderRadius: 16,
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
                  }}>
                    <h3 style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: 22, 
                      fontWeight: 600, 
                      color: COLORS.brown,
                      margin: 0,
                      marginBottom: '1.5rem'
                    }}>
                      {t('navbar.thingsToDo')}
                    </h3>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {favorites.activities.map((item) => (
                        <FavoriteCard key={item.id} item={item} type="App\\Models\\Activity" onRemove={removeFavorite} />
                      ))}
                    </div>
                  </div>
                )}

                {favorites.destinations && favorites.destinations.length > 0 && (
                  <div style={{
                    background: COLORS.cream,
                    borderRadius: 16,
                    padding: '2rem',
                    boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
                  }}>
                    <h3 style={{ 
                      fontFamily: "'Cormorant Garamond', serif", 
                      fontSize: 22, 
                      fontWeight: 600, 
                      color: COLORS.brown,
                      margin: 0,
                      marginBottom: '1.5rem'
                    }}>
                      {i18n.language === 'en' ? 'Destinations' : (i18n.language === 'fr' ? 'Destinations' : 'الوجهات')}
                    </h3>
                    <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                      {favorites.destinations.map((item) => (
                        <FavoriteCard key={item.id} item={item} type="App\\Models\\Destination" onRemove={removeFavorite} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FavoriteCard({ item, type, onRemove }) {
  const { i18n } = useTranslation()
  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(61,42,15,0.08)'
    }}>
      <div style={{ 
        height: 180, 
        background: COLORS.brownFaint, 
        overflow: 'hidden' 
      }}>
        <img
          src={getImageUrl(item)}
          alt={item.name || item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>
      <div style={{ padding: '1.25rem', background: COLORS.cream }}>
        <h4 style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: 18, 
          fontWeight: 600, 
          color: COLORS.brown,
          margin: 0,
          marginBottom: '0.5rem'
        }}>
          {item.name || item.title}
        </h4>
        <p style={{ fontSize: 13, color: COLORS.brownLight, margin: 0, marginBottom: '1rem' }}>
          {item.location}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {item.price && (
            <span style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: COLORS.gold,
              fontFamily: "'Cormorant Garamond', serif"
            }}>
              {formatPriceDH(item.price)}
            </span>
          )}
          <button
            onClick={() => onRemove(item.id, type)}
            style={{
              background: COLORS.gold,
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: 4,
              cursor: 'pointer',
              color: COLORS.cream,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            {i18n.language === 'en' ? 'Remove' : (i18n.language === 'fr' ? 'Supprimer' : 'إزالة')}
          </button>
        </div>
      </div>
    </div>
  )
}
