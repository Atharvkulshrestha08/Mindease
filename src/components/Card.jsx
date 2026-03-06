import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

const Card = ({ children, className, title, onClick }) => {
    return (
        <div className={clsx(styles.card, className)} onClick={onClick}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
