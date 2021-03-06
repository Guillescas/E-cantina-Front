import { ReactElement } from 'react';
import { FiPlus } from 'react-icons/fi';

import { useProductModal } from '../../hooks/productModal';

import { formatPrice } from '../../utils/formatPriceToBR';

import ProductModal from '../Modals/ProductModal';

import { StylesContainer } from './styles';

interface IProductProps {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  urlImage?: string;
  amount: number;
  observation?: string;
  cartItemId: number;
}

interface IProductCardProps {
  product: IProductProps;
  restaurantId: number;
}

const VerticalProductCard = ({
  product,
  restaurantId,
}: IProductCardProps): ReactElement => {
  const {
    productModalIsOpen,
    closeProductModal,
    setModalProductIsOpen,
  } = useProductModal();

  return (
    <StylesContainer>
      <ProductModal
        isModalOpen={productModalIsOpen}
        onRequestClose={closeProductModal}
        setModalProductIsOpen={setModalProductIsOpen}
        product={product}
        restaurantId={restaurantId}
      />

      {product && product.urlImage ? (
        <img
          src={`http://localhost:8080${product && product.urlImage}`}
          alt={`Imagem de ${product && product.name}`}
          id="vertocal-product-card-image"
        />
      ) : (
        <img
          src="/assets/food.jpeg"
          alt={`Imagem de ${product && product.name}`}
          id="vertocal-product-card-image"
        />
      )}

      <div className="infos">
        <h2>Cheese burger</h2>
        <p>Pão, carne e muito queijo</p>
        <span>{formatPrice(23.9)}</span>
      </div>

      <div
        className="icon"
        role="button"
        onClick={() => setModalProductIsOpen(true)}
      >
        <FiPlus size={22} />
        Ver mais
      </div>
    </StylesContainer>
  );
};

export default VerticalProductCard;
