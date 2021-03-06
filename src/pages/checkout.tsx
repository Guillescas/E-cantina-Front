import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import {
  FiArrowLeft,
  FiCalendar,
  FiCreditCard,
  FiHash,
  FiLock,
  FiPlus,
  FiSave,
  FiTag,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';

import BaseDashboard from '../components/BaseDashboard';
import InputWithMask from '../components/Inputs/InputWithMask';
import Input from '../components/Inputs/Input';
import Button from '../components/Button';
import SelectCreditCard from '../components/SelectCreditCard';

import { withSSRAuth } from '../utils/withSSRAuth';
import getvalidationErrors from '../utils/getValidationErrors';
import { formatPrice } from '../utils/formatPriceToBR';

import { useCart } from '../hooks/cart';
import { useAuth } from '../hooks/auth';

import { api } from '../services/apiClient';

import { StylesContainer } from '../styles/Pages/Checkout';
import ButtonWithIcon from '../components/ButtonWithIcon';

interface IAddCreditCardFormData {
  nickname: string;
  owner: string;
  cardNumber: string;
  validThru: string;
  cvv: string;
  cpfClient: string;
}

interface ICreditCardData {
  id: number;
  nickname: string;
  owner: string;
  cardNumber: string;
  validThru: string;
  cvv: string;
}

const Checkout = (): ReactElement => {
  const { user } = useAuth();
  const { cart, totalCartPrice, discount, discountId, clearCart } = useCart();

  const router = useRouter();

  const addCreditCardFormRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [userCreditCards, setUserCreditCards] = useState<ICreditCardData[]>([]);
  const [isUserAddingCard, setIsUserAddingCard] = useState(false);
  const [selectedCreditCardId, setSelectedCreditCardId] = useState<number>();

  useEffect(() => {
    api
      .get(`/client/${user.sub}`)
      .then(response => {
        setUserCreditCards(response.data.cards);
      })
      .catch(error => {
        console.log(error);
      });
  }, [user]);

  const handleCheckoutSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      if (!selectedCreditCardId) {
        setIsLoading(false);
        return toast.error('Voc?? deve selecionar um m??todo de pagamento');
      }

      const orderData = {
        clientId: Number(user.sub),
        restaurantId: cart[0].restaurantId,
        discountId,
        observation: null,
        productList: cart.map(product => {
          return {
            productId: product.id,
            quantity: product.amount,
            description: product.observation,
          };
        }),
      };

      api
        .post('/order', orderData)
        .then(() => {
          toast.success('Pedido realizado com sucesso');
          clearCart();
          router.push('/orders');
        })
        .catch(error => {
          toast.error(error);
        });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [cart, clearCart, discountId, router, selectedCreditCardId, user]);

  const handleAddCreditCard = useCallback(
    async (data: IAddCreditCardFormData) => {
      setIsLoading(true);
      try {
        addCreditCardFormRef.current?.setErrors({});

        const schema = Yup.object().shape({
          nickname: Yup.string().required('Apelido obrigat??rio'),
          owner: Yup.string().required('Nome no cart??o obrigat??rio'),
          cardNumber: Yup.string().required('N??mero do cart??o obrigat??rio'),
          validThru: Yup.string().required(
            'Data de validade do cart??o obrigat??ria',
          ),
          cvv: Yup.string().required('CVV do cart??o obrigat??rio'),
          cpfClient: Yup.string().required('CPF do titular obrigat??rio'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const creditCardData = {
          nickname: data.nickname,
          owner: data.owner,
          cardNumber: data.cardNumber.replaceAll('-', ''),
          validThru: `28/${data.validThru.slice(
            0,
            -3,
          )}/20${data.validThru.slice(-2)}`,
          cvv: data.cvv,
          bank: data.nickname,
          cpfClient: data.cpfClient,
        };

        api
          .post('/card', creditCardData)
          .then(response => {
            toast.success('Cart??o adicionado com sucesso');
            setUserCreditCards([...userCreditCards, response.data]);
            addCreditCardFormRef.current.reset();
          })
          .catch(error => {
            return toast.error(error.response.daat.message);
          });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getvalidationErrors(error);

          addCreditCardFormRef.current?.setErrors(errors);
        }
      }
      setIsUserAddingCard(false);
      setIsLoading(false);
    },
    [userCreditCards],
  );

  return (
    <BaseDashboard>
      <StylesContainer>
        <Link href="/cart">
          <div className="back-button">
            <FiArrowLeft />
            <p>Voltar</p>
          </div>
        </Link>

        <h1>Pagamento</h1>

        <div className="resume">
          <div className="card-area">
            <div className="card-area-title">
              <h2>Meus cart??es</h2>

              {isUserAddingCard ? (
                <a role="button" onClick={() => setIsUserAddingCard(false)}>
                  <FiX />
                  Cancelar
                </a>
              ) : (
                <a role="button" onClick={() => setIsUserAddingCard(true)}>
                  <FiPlus />
                  Adicionar cart??o
                </a>
              )}
            </div>

            <div className="cards">
              {userCreditCards.map(userCreditCard => (
                <SelectCreditCard
                  key={userCreditCard.id}
                  id={userCreditCard.id}
                  nickname={userCreditCard.nickname}
                  cardNumber={userCreditCard.cardNumber}
                  selected={selectedCreditCardId === userCreditCard.id}
                  setSelectedCreditCardId={setSelectedCreditCardId}
                />
              ))}
            </div>

            {userCreditCards.length === 0 && (
              <p className="no-cards">
                Voc?? n??o possui nenhum cart??o cadastrado :(
              </p>
            )}

            {isUserAddingCard && (
              <Form ref={addCreditCardFormRef} onSubmit={handleAddCreditCard}>
                <div className="card-title">
                  <h2>Informa????es sobre pagamento</h2>

                  <ButtonWithIcon
                    type="button"
                    icon={FiSave}
                    isSuccess
                    onClick={() => addCreditCardFormRef.current.submitForm()}
                  >
                    Salvar
                  </ButtonWithIcon>
                </div>

                <Input
                  name="nickname"
                  icon={FiTag}
                  label="Apelido do cart??o"
                  placeholder="Apelido do cart??o"
                />
                <InputWithMask
                  name="cpfClient"
                  icon={FiCreditCard}
                  label="CPF do titular do cart??o"
                  placeholder="CPF do titular do cart??o"
                  mask="999.999.999-99"
                />
                <Input
                  name="owner"
                  icon={FiUser}
                  label="Nome no cart??o"
                  placeholder="Nome no cart??o"
                  isInUppercase
                />
                <InputWithMask
                  name="cardNumber"
                  icon={FiHash}
                  label="N??mero no cart??o"
                  placeholder="N??mero no cart??o"
                  mask="9999-9999-9999-9999"
                />
                <div className="inline-inputs">
                  <InputWithMask
                    name="validThru"
                    icon={FiCalendar}
                    label="Data de validade"
                    placeholder="Data de validade"
                    mask="99/99"
                  />
                  <Input
                    name="cvv"
                    icon={FiLock}
                    label="CVV"
                    placeholder="CVV"
                  />
                </div>
              </Form>
            )}
          </div>

          <div>
            <h2>Resumo da compra</h2>

            <table>
              <tr>
                <th>Total de itens:</th>
                <td>{cart.length}</td>
              </tr>
              <tr>
                <th>Desconto:</th>
                <td>{formatPrice(Number(discount))}</td>
              </tr>
              <tr>
                <th>Pre??o final:</th>
                <td>{formatPrice(Number(totalCartPrice()))}</td>
              </tr>
            </table>

            <Button
              className="checkout-button"
              onClick={handleCheckoutSubmit}
              isLoading={isLoading}
            >
              Finalizar pedido
            </Button>
          </div>
        </div>
      </StylesContainer>
    </BaseDashboard>
  );
};

export default Checkout;

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
