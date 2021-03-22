import { useEffect, useState } from 'react';

import {Header} from '../../components/Header';
import api from '../../services/api';
import {Food} from '../../components/Food';
import {ModalAddFood} from '../../components/ModalAddFood';
import {ModalEditFood} from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodType {
  id: number;
  isAvailable: boolean;
  image: string;
  name: string;
  description: string;
  price: number;
}



function Dashboard () {
 const [foods, setFoods] = useState<FoodType[]>([]);
 const [editingFood, setEditingFood] = useState({} as FoodType);
 const [modalOpen, setmodalOpen] = useState(false);
 const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    try {
      const getFood = async() => {
        const response = await api.get<FoodType[]>('/foods');
        
        setFoods(response.data)
      }
      getFood()
    }catch(err) {
      console.log(err, 'Error on load items')
    }
  }, [])

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

     setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

 async function handleDeleteFood (id: number) {

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods( foodsFiltered );
  }

  function toggleModal () {
    setmodalOpen(!modalOpen);
  }

  function toggleEditModal  ()  {

    setEditModalOpen( !editModalOpen );
  }

  function handleEditFood (food: FoodType) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
  }

export default Dashboard;
