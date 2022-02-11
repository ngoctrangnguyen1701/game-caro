import * as React from 'react';
import PropTypes from 'prop-types';
import ButtonUnstyled, { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import {AddCircleOutline} from '@mui/icons-material';

const ButtonRoot = React.forwardRef(function ButtonRoot(props, ref) {
  const { children, ...other } = props;

  return (
    <svg width="200" height="30" {...other} ref={ref}>
      <polygon points="0,30 0,0 200,0 200,30" className="bg" />
      <polygon points="0,30 0,0 200,0 200,30" className="borderEffect" />
      <foreignObject x="0" y="0" width="200" height="30">
        <div className="content">{children}</div>
      </foreignObject>
    </svg>
  );
});

ButtonRoot.propTypes = {
  children: PropTypes.node,
};

const grey = {
  30: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  800: '#424242',
  900: '#212121',
};

const CustomButtonRoot = styled(ButtonRoot)(
  ({ theme }) => `
  overflow: visible;
  cursor: pointer;
  --main-color: ${theme.palette.mode === 'light' ? grey[600] : grey[100]};
  --hover-color: ${theme.palette.mode === 'light' ? grey[30] : grey[900]};
  --active-color: ${theme.palette.mode === 'light' ? grey[100] : grey[800]};

  & polygon {
    fill: transparent;
    transition: all 800ms ease;
    pointer-events: none;
  }
  
  & .bg {
    stroke: var(--main-color);
    stroke-width: 1;
    filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1));
    fill: transparent;
  }

  & .borderEffect {
    stroke: var(--main-color);
    stroke-width: 2;
    stroke-dasharray: 200 600;
    stroke-dashoffset: 200;
    fill: transparent;
  }

  &:hover,
  &.${buttonUnstyledClasses.focusVisible} {
    .borderEffect {
      stroke-dashoffset: -600;
    }

    .bg {
      fill: var(--hover-color);
    }
  }

  &:focus,
  &.${buttonUnstyledClasses.focusVisible} {
    outline: 2px solid ${theme.palette.mode === 'dark' ? grey[400] : grey[200]};
    outline-offset: 2px;
  }

  &.${buttonUnstyledClasses.active} { 
    & .bg {
      fill: var(--active-color);
      transition: fill 300ms ease-out;
    }
  }

  & foreignObject {
    pointer-events: none;

    & .content {
      font-size: 0.875rem;
      font-family: IBM Plex Sans, sans-serif;
      font-weight: 500;
      line-height: 1.5;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--main-color);
      text-transform: uppercase;
    }

    & svg {
      margin: 0 5px;
    }
  }`,
);

const SvgButton = React.forwardRef(function SvgButton(props, ref) {
  return <ButtonUnstyled {...props} component={CustomButtonRoot} ref={ref} />;
});

export default function ButtonCreateRoom() {
  return <SvgButton><AddCircleOutline/></SvgButton>;
}