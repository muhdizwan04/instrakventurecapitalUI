import React from 'react';
import styles from './LoadingOverlay.module.css';

const LoadingOverlay = ({ isVisible, message = "Loading..." }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.spinnerContainer}>
                    <div className={styles.spinner}></div>
                    <div className={styles.spinnerRing}></div>
                </div>
                <p className={styles.message}>{message}</p>
                <p className={styles.hint}>Please wait...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
