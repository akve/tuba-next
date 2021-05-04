import React from 'react';
import { Modal } from '@pdeals/next/elements/Modal';
import { resizeImage } from '@pdeals/next/utils/helpers';
// import { ProductGallery } from 'components/ProductGallery';

const ImageModal = (props) => {
  const { isModalOpened, closeModal } = props;

  const isColor = typeof isModalOpened === 'string' && `${isModalOpened}`.startsWith('color:');
  return (
    <>
      {!!isModalOpened && (
        <Modal onClose={closeModal}>
          <div className="modal-wrapper">
            {isColor && <img src={resizeImage(isModalOpened.replace('color:', ''), 'normal')} className="big-image" />}
            {!isColor && (
              <img src={resizeImage(isModalOpened.replace('product:', ''), 'huge')} className="big-product" />
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default ImageModal;
