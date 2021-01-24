import classnames from 'classnames';

import styles from './ImagePanel.module.scss';

export interface ImagePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

const ImagePanel: React.FC<ImagePanelProps> = (props) => {
  const { src, className, style, ...otherProps } = props;
  return (
    <div
      className={classnames(styles.panel, className)}
      style={{ backgroundImage: `url("${src}")`, ...style }}
      {...otherProps}
      tabIndex={0}
    />
  );
};

export default ImagePanel;
