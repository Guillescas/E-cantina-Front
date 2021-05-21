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

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

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
      .get(`/restaurant?nameRestaurant=${restaurantName.keyword}`, {
        headers: { authorization: `Bearer ${token}` },
      })
      .then(response => {
        console.log(response.status);
        setRestaurants(response.data.content);
      })
      .catch(error => {
        if (error.response.status === 403) {
          signOut();
          return toast.info('Seu token foi expirado. Faça login novamente');
        }

        return toast.error('Houve um erro inesperado. Tente mais tarde');
      });
  }, [token, restaurantName, signOut]);

  return (
    <StylesContainer>
      <SEO title="Dashboard" />
      <TopDashboardMenu
        setIsLoading={setIsLoading}
        setRestaurants={setRestaurants}
      />

      <Content>
        <LeftDashboardMenu />

        <ContentList>
          <div className="categories">
            <SearchByTypeCard
              categoryName="Lanches"
              imagePath="hamburger.jpeg"
            />
            <SearchByTypeCard categoryName="Japonês" imagePath="japa.jpeg" />
            <SearchByTypeCard
              categoryName="Vegetariana"
              imagePath="vegan.jpeg"
            />
            <SearchByTypeCard
              categoryName="Brasileira"
              imagePath="brasiliam.jpeg"
            />
            <SearchByTypeCard categoryName="Bebidas" imagePath="drink.jpeg" />
          </div>

          <div className="search-result-bar">
            <h2>
              Resultados de busca para:{' '}
              <strong>{restaurantName.keyword}</strong>{' '}
            </h2>

            <button type="button">
              <span>Cancelar pesquisa</span>
              <FiX className="icon" size={16} />
            </button>
          </div>

          {isLoading && <Loading />}
          {restaurants.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              id={restaurant.id}
              name={restaurant.name}
              description={restaurant.description}
            />
          ))}
          {restaurants === [] && <h2>Não foi encontrado nenhum restaurante</h2>}
        </ContentList>
      </Content>
    </StylesContainer>
  );
};

export default Search;
