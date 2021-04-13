import React from 'react';
import { inject, observer } from 'mobx-react';
import UiStore from '@pdeals/next/stores/uiStore';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-sea-green.min.css';
import { resizeImage } from '@pdeals/next/utils/helpers';

interface IProps {
  uiStore?: UiStore;
}

class ThumbnailSlider extends React.Component<IProps, any> {
  primaryRef: any;
  secondaryRef: any;

  constructor(props) {
    super(props);

    this.primaryRef = React.createRef();
    this.secondaryRef = React.createRef();
  }

  componentDidMount() {
    // Set the sync target right after the component is mounted.
    //if (window.)
    this.primaryRef.current.sync(this.secondaryRef.current.splide);
    if (window.outerWidth > 700) {
      this.props.uiStore!.setSliderWidth(
        document.getElementById('splide01')!.offsetWidth + document.getElementById('splide02')!.offsetWidth
      );
    }
  }

  renderSecondary() {
    const isMobile = window.outerWidth < 700;
    const product = this.props.uiStore!.ProductDetails;

    const secondaryOptions = {
      rewind: true,
      fixedWidth: 70,
      fixedHeight: 100,
      isNavigation: true,
      gap: isMobile ? 5 : 10,
      focus: 'center',
      pagination: false,
      cover: true,
      direction: !isMobile ? 'ttb' : '',
      height: !isMobile ? '450px' : '',
      breakpoints: {
        '600': {
          fixedWidth: 50,
          fixedHeight: 35,
        },
      },
    };

    return (
      <div style={isMobile ? { width: '100%' } : {}}>
        <Splide
          id="splide01"
          options={secondaryOptions}
          ref={this.secondaryRef}
          className={isMobile ? 'slider-secondary-mobile' : ''}
        >
          {!!product.data &&
            product.data.images.map((image, index) => (
              <SplideSlide key={`${index}`}>
                <img src={resizeImage(image.image, 'thumb')} alt="Image 1" />
              </SplideSlide>
            ))}
        </Splide>
      </div>
    );
  }

  render() {
    if (typeof window === 'undefined') return null;
    const product = this.props.uiStore!.ProductDetails;

    const isMobile = window.outerWidth < 700;
    /*const primaryOptions = {
      type: 'loop',
      width: 800,
      perPage: 2,
      perMove: 1,
      gap: '1rem',
      pagination: false,
    };*/
    const isHuge = window.outerWidth > 1400;

    function getImgWidth() {
      if (isMobile) {
        return 450;
      }
      if (isHuge) {
        return 600;
      }
      return 500;
    }

    const primaryOptions = isMobile
      ? {
          type: 'fade',
          autoHeight: true,
          autoWidth: true,
          perPage: 1,
          perMove: 1,
          pagination: false,
          arrows: true,
          cover: false,
        }
      : {
          type: 'fade',
          height: `${getImgWidth()}px`,
          autoWidth: true,
          perPage: 1,
          perMove: 1,
          pagination: false,
          arrows: true,
          cover: false,
        };

    /*const secondaryOptions = {
      type: 'slide',
      rewind: true,
      width: 800,
      gap: '1rem',
      pagination: false,
      fixedWidth: 110,
      fixedHeight: 70,
      cover: true,
      focus: 'center',
      isNavigation: true,
      updateOnMove: true,
    };*/

    return (
      <>
        {!isMobile && this.renderSecondary()}
        <div style={{ paddingLeft: isMobile ? 0 : '15px' }}>
          <Splide id="splide02" options={primaryOptions} ref={this.primaryRef}>
            {!!product.data &&
              product.data.images.map((image, index) => (
                <SplideSlide key={`${index}`}>
                  <img src={resizeImage(image.image, 'normal')} alt="Image 1" height={getImgWidth()} />{' '}
                  {/*style={{ maxWidth: 'calc(100vw-60px)' }}*/}
                </SplideSlide>
              ))}
          </Splide>
        </div>
        {isMobile && this.renderSecondary()}
      </>
    );
  }
}

/*function Slider(props: IProps) {
  const { uiStore } = props;

  return (
    <>
      <Splide>
        <SplideSlide>
          <img
            src="https://res.cloudinary.com/dble3qk6e/image/upload/h_450/v1607120387/tuba/111/12.jpg"
            alt="Image 1"
          />
        </SplideSlide>
        <SplideSlide>
          <img
            src="https://res.cloudinary.com/dble3qk6e/image/upload/h_450/v1607120391/tuba/111/21.jpg"
            alt="Image 2"
          />
        </SplideSlide>
      </Splide>
    </>
  );
}*/

export default inject('uiStore')(observer(ThumbnailSlider));
