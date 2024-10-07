import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import './card.css';

const Card = () => {
  const [data, setData] = useState([]);
  const [deleteState, setDeleteState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const navigate = useNavigate();

  


  useEffect(() => {
    console.log("fetch");

    axios.get('http://localhost:3005/api/getall')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, [deleteState]);

  const handleDelete = (id) => {
    setIsLoading(true);
    axios.delete(`http://localhost:3005/api/delete/${id}`)
      .then(res => {
        setIsLoading(false);
        setDeleteState(prev => !prev);
      })
      .catch(error => {
        console.error('Ошибка при удалении продукта:', error);
        setIsLoading(false);
      });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleUpdate = (updatedProduct) => {
    axios.put(`http://localhost:3005/api/update/${editProduct._id}`, updatedProduct)
      .then(response => {
        setOpenEditModal(false);
        setDeleteState(prev => !prev);
      })
      .catch(error => {
        console.error('Ошибка при обновлении продукта:', error);
      });
  };

  const handleAddProduct = (newProduct) => {
    axios.post('http://localhost:3005/api/add', newProduct)
      .then((res) => {
      

        setOpenAddModal(false)
      })
      .catch(error => {
        console.error('Ошибка при добавлении продукта:', error);
      })
  };

  const handleViewStudents = (groupId) => {
    navigate(`/students/${groupId}`);
  };

  return (
    <div className="container">


      <div className='card'>
        {data.map((item, index) => (
          <div className="box" key={index}>
            <p>{item.nomi}</p>
            <p>{item.kuni}</p>
            <h4>{item.vaqti}</h4>
            <span>{item.oqituvchi}</span>
            <button onClick={() => handleViewStudents(item._id)}>Куриб чикиш</button>
            <div className="delete__create" style={{ display: 'flex', alignItems: "center", gap: "4px" }}>
              <button className='delete__btn' onClick={() => handleDelete(item._id)} disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} /> : 'Учириш'}
                {!isLoading && <DeleteIcon sx={{ color: "crimson", cursor: 'pointer' }} />}
              </button>
              <button className='create__btn' onClick={() => handleEdit(item)}>
                Узгартириш
                <BorderColorIcon sx={{ color: "lightgreen", cursor: 'pointer' }} />
              </button>
            </div>
          </div>
        ))}

        {/* Модальное окно для изменения продукта */}
        {openEditModal && (
          <div className='modal'>
            <div className="modal-content">
              <span className='close' onClick={handleCloseEditModal}>&times;</span>
              <form onSubmit={(e) => {
                e.preventDefault();
                const updatedProduct = {
                  nomi: e.target.nomi.value,
                  kuni: e.target.kuni.value,
                  vaqti: e.target.vaqti.value,
                  oqituvchi: e.target.oqituvchi.value,
                };
                handleUpdate(updatedProduct);
              }} className='modal__form'>
                <input
                  type="text"
                  name="nomi"
                  placeholder='Гурух номи'
                  defaultValue={editProduct?.nomi || ''}
                />
                <select name="kuni" defaultValue={editProduct?.kuni || ''}>
                  <option value="">Кунларни танланг</option>
                  <option value="Душанба, Чоршанба, Жума">Жуфт кунлари (Душанба, Чоршанба, Жума)</option>
                  <option value="Сешанба, Пайшанба, Шанба">Ток кунлар (Сешанба, Пайшанба, Шанба)</option>
                </select>
                <input
                  type="text"
                  name="vaqti"
                  placeholder='Вакти'
                  defaultValue={editProduct?.vaqti || ''}
                />
                <select name="oqituvchi" defaultValue={editProduct?.oqituvchi || ''}>
                  <option value="">Укитувчи танланг</option>
                  <option value="Али">Али</option>
                  <option value="Бекзод">Бекзод</option>
                  <option value="Дилшод">Дилшод</option>
                </select>
                <button type="submit">Узгаришни саклаш</button>
              </form>
            </div>
          </div>
        )}

        {/* Модальное окно для добавления продукта */}
        {openAddModal && (
          <div className='modal'>
            <div className="modal-content">
              <span className='close' onClick={() => setOpenAddModal(false)}>&times;</span>
              <form onSubmit={(e) => {
                e.preventDefault();
                const newProduct = {
                  nomi: e.target.nomi.value,
                  kuni: e.target.kuni.value,
                  vaqti: e.target.vaqti.value,
                  oqituvchi: e.target.oqituvchi.value,
                };
                handleAddProduct(newProduct);
              }} className='modal__form'>
                <input
                  type="text"
                  name="nomi"
                  placeholder='Гурух номи'
                />
                <select name="kuni">
                  <option value="">Кунларни танланг</option>
                  <option value="Душанба, Чоршанба, Жума">Жуфт кунлари (Душанба, Чоршанба, Жума)</option>
                  <option value="Сешанба, Пайшанба, Шанба">Ток кунлар (Сешанба, Пайшанба, Шанба)</option>
                </select>
                <input
                  type="text"
                  name="vaqti"
                  placeholder='Вакти'
                />
                <select name="oqituvchi">
                  <option value="">Укитувчи танланг</option>
                  <option value="Али">Али</option>
                  <option value="Бекзод">Бекзод</option>
                  <option value="Дилшод">Дилшод</option>
                </select>
                <button type="submit">Саклаш</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
