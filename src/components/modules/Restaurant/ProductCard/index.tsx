import { ReactElement } from 'react';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { useProductModal } from '../../../../hooks/productModal';

import { formatPrice } from '../../../../utils/formatPriceToBR';
import EditProductModal from '../../../Modals/EditProductModal';

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

const ProductCard = ({
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
      <EditProductModal
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
        />
      ) : (
        <img
          src="/assets/food.jpeg"
          alt={`Imagem de ${product && product.name}`}
        />
      )}
      <h2>{product && product.name}</h2>
      <p>{product && product.description}</p>
      <span>{formatPrice(product && product.price)}</span>

      <button type="button" onClick={() => setModalProductIsOpen(true)}>
        <FiEdit2 />
        <p>Editar</p>
      </button>
    </StylesContainer>
  );
};

export default ProductCard;
