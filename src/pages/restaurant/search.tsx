import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import LeftDashboardMenu from '../../components/LeftDashboardMenu';
import Loading from '../../components/Loading';
import RestaurantCard from '../../components/RestaurantCard';
import SearchByTypeCard from '../../components/SearchByTypeCard';
import SEO from '../../components/SEO';
import TopDashboardMenu from '../../components/TopDashboardMenu';
import ButtonWithIcon from '../../components/ButtonWithIcon';

import { useAuth } from '../../hooks/auth';

import { api } from '../../services/apiClient';

import { withSSRAuth } from '../../utils/withSSRAuth';

import {
  StylesContainer,
  Content,
  ContentList,
} from '../../styles/Pages/Search';

interface IRestaurantProps {
  id: number;
  email: string;
  name: string;
  description?: string;
  category: {
    id: number;
    name: string;
  };
}

const Search = (): ReactElement => {
  const { token, signOut } = useAuth();

  const router = useRouter();

  const restaurantName = router.query;

  const [restaurants, setRestaurants] = useState<IRestaurantProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api
      .get(`/restaurant?nameRestaurant=${restaurantName.keyword}`)
      .then(response => {
        setRestaurants(response.data.content);
      })
      .catch(() => {
        return toast.error('Houve um erro inesperado. Tente mais tarde');
      });
  }, [token, restaurantName, signOut]);

  return (
    <StylesContainer>
      <SEO title="Dashboard" />
      <TopDashboardMenu setIsLoading={setIsLoading} />

      <Content>
        <LeftDashboardMenu />

        <ContentList>
          <div className="categories">
            <SearchByTypeCard
              categoryName="Lanches"
              imagePath="hamburger.jpeg"
              color="db5a40"
            />
            <SearchByTypeCard
              categoryName="Japonês"
              imagePath="japa.jpeg"
              color="8C52FF"
            />
            <SearchByTypeCard
              categoryName="Vegetariana"
              imagePath="vegan.jpeg"
              color="7ED957"
            />
            <SearchByTypeCard
              categoryName="Brasileira"
              imagePath="brasiliam.jpeg"
              color="FF914D"
            />
            <SearchByTypeCard
              categoryName="Bebidas"
              imagePath="drink.jpeg"
              color="FFDE59"
            />
          </div>

          <div className="search-result-bar">
            <h2>
              Resultados de busca para:{' '}
              <strong>{restaurantName.keyword}</strong>{' '}
            </h2>

            <ButtonWithIcon icon={FiX}>Cancelar pesquisa</ButtonWithIcon>
          </div>

          {isLoading && (
            <div className="loading">
              <Loading />
            </div>
          )}

          {restaurants.length === 0 && (
            <div className="no-restaurants">
              <p>Não foi encontrado nenhum restaurante :(</p>
            </div>
          )}

          {restaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
            />
          ))}
        </ContentList>
      </Content>
    </StylesContainer>
  );
};

export default Search;

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
