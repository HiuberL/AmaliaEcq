'use client';

import MessageAlert from '@/components/messageAlert';
import { useLayout } from '@/hooks/Layout/useLayout';
import { existsToken } from '@/utils/cookies.utils';
import style from '@styles/root.module.css';
import { Bell, Home, LogIn, LogOut, Menu, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import Loading from './loading';
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
        <header className={`${style.mainHeader} ${isHeaderTransparent ? style.headerTransparent : ''}`}>
          <button
            className={`${style.headerBtn} ${style.mobileMenuBtn}`}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className={style.headerLogo}>
            <Link href="/">
              <img src="/assets/logo_Cropped.png" alt="Logo Amalia Ec" width={50} />
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
            <button className={style.headerBtn} onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
            </button>
            <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)}>
              <CartContent />
            </CartSidebar>
            {!isLogin ? (
              <Link href="/login" className={style.headerBtnL}>
                <LogIn size={20} />
              </Link>
            ) : (
              /* 📦 Contenedor padre que controlará el hover */
              <div className={style.userMenuContainer}>

                {/* El botón principal del usuario */}
                <button className={style.headerBtnL}>
                  <User size={20} />
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
              <p>Breve descripción de lo que hace tu marca o proyecto.</p>
            </div>
            <div className={style.footerSection}>
              <h3>Enlaces Rápidos</h3>
              <ul>
                <li><Link href="/faq">Preguntas Frecuentes</Link></li>
                <li><Link href="/citas">Reserva una Cita</Link></li>
                <li><Link href="/contacto">Contacto</Link></li>
              </ul>
            </div>
            <div className={style.footerSection}>
              <ul className={style.contactList}>
                <li>+593999092702</li>
                <li>info@amaliaecq.com</li>
                <li>Ecuador, Pichincha, Quito, Islas Malvinas y E1F</li>
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