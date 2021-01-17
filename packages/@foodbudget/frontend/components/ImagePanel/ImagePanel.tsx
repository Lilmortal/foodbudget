import styled from 'styled-components';

export interface ImagePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  onClick?(): void;
}

const StyledImagePanel = styled.div<ImagePanelProps>((props) => ({
  display: 'flex',
  height: '200px',
  backgroundImage: `url("${props.src}")`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
}));

const ImagePanel: React.FC<ImagePanelProps> = (props) => {
  const { onClick, ...otherProps } = props;
  return <StyledImagePanel {...otherProps} tabIndex={0} />;
};

export default ImagePanel;
