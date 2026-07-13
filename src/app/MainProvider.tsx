'use client';

import MessageAlert from '@/components/messageAlert';
import { useLayout } from '@/hooks/Layout/useLayout';

import style from '@styles/root.module.css';
import { Home, LogIn, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import CartContent from '@/components/cartComponent';
import CartSidebar from '@/components/cartSideBar';
import { useLayoutContext } from './layoutContext';

export default function MainProvider({ children }: { children: React.ReactNode }) {
  const {
    menuOpen,
    setMenuOpen,
    isHeaderTransparent,
    showFooter,
    showHeader,
    isLogin,
    onLogout,
  } = useLayout();

  const {
    setCartOpen,
    cartOpen
  } = useLayoutContext();
  return (
    <div className={`${style.principalContainer} ${style.principalContainerBackground}`}>

      {/* ================= HEADER ================= */}

      {showHeader &&
        <header className={`${style.mainHeader} ${isHeaderTransparent ? style.headerTransparent : ''}`} >

          <div className={style.headerLogo} >
            <Link className={style.headerLogo} href="/">
              <img src="/assets/logo_Cropped.png" alt="Logo Amalia Ec" width={40} />
            </Link>
          </div>

          <nav className={`${style.mainNav} ${menuOpen ? style.navActive : ''}`}>
            <button
              className={style.closeMenuBtn}
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </button>

            <ul className={style.navList}>
              <li><Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
              <li><Link href="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</Link></li>
              <li><Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link></li>
              <li className={style.hasSubmenu}>
                <span className={style.submenuTrigger}>Sorteos</span>
                <ul className={style.submenu}>
                  <li><Link href="/sorteo/juegaygana" onClick={() => setMenuOpen(false)}>Juega y Gana</Link></li>
                </ul>
              </li>
              <li className={style.hasSubmenu}>
                <span className={style.submenuTrigger}>Tienda</span>
                <ul className={style.submenu}>
                  <li><Link href="/tienda/perfumes" onClick={() => setMenuOpen(false)}>Perfumes</Link></li>
                  <li><Link href="/tienda/maquillajes" onClick={() => setMenuOpen(false)}>Maquillajes</Link></li>
                </ul>
              </li>

              <li><Link href="/solicitudes" onClick={() => setMenuOpen(false)}>Solicitudes</Link></li>
              <li><Link href="/citas" onClick={() => setMenuOpen(false)}>Citas</Link></li>
              <li><Link href="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link></li>
            </ul>
          </nav>

          {menuOpen && (
            <div
              className={style.menuOverlay}
              onClick={() => setMenuOpen(false)}
            />
          )}

          <div className={style.headerActions}>
            <button
              className={`${style.headerBtn} ${style.mobileMenuBtn}`}
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={16} />
            </button>

            <button className={style.headerBtn} onClick={() => setCartOpen(true)}>
              <ShoppingCart size={16} />
            </button>
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)}>
              <CartContent />
            </CartSidebar>
            {!isLogin ? (
              <Link href="/login" className={style.headerBtnL}>
                <LogIn size={16} />
              </Link>
            ) : (
              /* 📦 Contenedor padre que controlará el hover */
              <div className={style.userMenuContainer}>

                {/* El botón principal del usuario */}
                <button className={style.headerBtnL}>
                  <User size={16} />
                </button>

                {/* 📋 El submenú desplegable flotante */}
                <div className={style.dropdownMenu}>

                  <Link href="/espacio/informacion" className={style.dropdownItem}>
                    <Home size={16} />
                    <span>Mi Espacio</span>
                  </Link>

                  {/* Reemplaza este botón o enlace con tu Server Action de cerrarSesion en el onClick si es necesario */}
                  <button className={style.dropdownItem} onClick={() => onLogout()}>
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>

                </div>
              </div>
            )}

          </div>
        </header>
      }
      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <a href="https://wa.me/593999092702?text=Hola,%20quisiera%20más%20información"
        className={style.btnWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" className={style.whatsappicon} viewBox="0 0 24 24" fill="white">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>
      <main className={style.mainContent}>
        <MessageAlert />

        {children}
      </main>

      {/* ================= FOOTER ================= */}
      {showFooter && (
        <footer className={style.mainFooter}>
          <div className={style.footerGrid}>
            <div className={style.footerSection}>
              <h3>Sobre Nosotros</h3>
              <p>Somos una tienda semi Online ubicados en la ciudad de Quito, hacemos envíos a nivel nacional por servientrega o cooperativa. 
                Trabajamos bajo la modalidad de citas por lo que puedes separar la tuya y conocer este mundo tan maravilloso de perfumería árabe 
                y maquillajes de excelente calidad.
                <br/>
                <br/>
                Nuestra misión es conectar a nuestros clientes con la excelencia y el lujo auténtico, 
                convirtiéndonos en su aliado de máxima confianza a la hora de elegir fragancias y productos de bienestar 
                verdaderamente originales.  
              </p>
            </div>
            <div className={style.footerSection}>
              <h3>Enlaces Rápidos</h3>
              <ul>
                <li><Link href="/faq">Preguntas Frecuentes</Link></li>
                <li><Link href="/solicitudes">Realizar solicitudes</Link></li>
                <li><Link href="/citas">Reserva una Cita</Link></li>
                <li><Link href="/tienda/perfumes">Tienda Perfumes</Link></li>
                <li><Link href="/tienda/maquillajes">Tienda Maquillajes</Link></li>
              </ul>
            </div>
            <div className={style.footerSection}>
              <ul className={style.contactList}>
                <li><a href="https://wa.me/593999092702?text=Hola,%20quisiera%20más%20información" target="_blank" rel="noopener noreferrer">+593999092702</a></li>
                <li><a href="https://maps.app.goo.gl/bpAAvwTbbFjJmZvt7" target="_blank" rel="noopener noreferrer">Ecuador, Pichincha, Quito, Islas Malvinas y E1F</a></li>

                <li>info@amaliaecq.com</li>
              </ul>
              <div className={style.socialContainer}>
                {/* Instagram */}
                <a href="https://instagram.com/amalia.ecq" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a href="https://facebook.com/amaliaecq" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a href="https://tiktok.com/@amalia.ec" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              </div>
              <hr className={style.footerDivider} />

              <ul className={style.policyList}>
                <li><Link href="/politica/politica-reembolso">Política de Reembolso</Link></li>
                <li><Link href="/politica/politica-envio">Política de Envío</Link></li>
                <li><Link href="/politica/declaracion-accesibilidad">Declaración de Accesibilidad</Link></li>
                <li><Link href="/politica/terminos-condiciones">Términos y Condiciones</Link></li>
                <li><Link href="/politica/politica-privacidad">Políticas de privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className={style.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Amaliaec. Todos los derechos reservados.</p>
          </div>
        </footer>
      )}
    </div>
  );
}