import styles from '@styles/shared/loading.module.css'; // Ajusta la ruta a tus estilos

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinnerOuter} />
        <img src="/assets/logo_Cropped.png" width={40}/>
        <div className={styles.spinnerInner} />
      </div>
    </div>
  );
}