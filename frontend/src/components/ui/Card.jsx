import React from 'react';

/**
 * Card Component
 * @param {string} title - Card title
 * @param {React.ReactNode} header - Custom header content
 * @param {React.ReactNode} footer - Footer content
 * @param {string} variant - Card style: 'default', 'outlined', 'elevated'
 * @param {boolean} hoverable - Add hover effect
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} children - Card content
 */
const Card = ({
  title,
  header,
  footer,
  variant = 'default',
  hoverable = false,
  className = '',
  children,
  ...props
}) => {
  // Base classes
  const baseClasses = 'card';
  
  // Variant classes
  const variantClasses = {
    default: 'card-default',
    outlined: 'card-outlined',
    elevated: 'card-elevated',
  };
  
  // Combine classes
  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    hoverable ? 'card-hoverable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div className={classes} {...props}>
      {(title || header) && (
        <div className="card-header">
          {header || <h3 className="card-title">{title}</h3>}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Card Header Component
 */
export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

/**
 * Card Body Component
 */
export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

/**
 * Card Footer Component
 */
export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

/**
 * Card Title Component
 */
export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`card-title ${className}`}>{children}</h3>
);

/**
 * Card Subtitle Component
 */
export const CardSubtitle = ({ children, className = '' }) => (
  <p className={`card-subtitle ${className}`}>{children}</p>
);

export default Card;