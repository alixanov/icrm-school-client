
import React from 'react';
import { useForm } from 'react-hook-form';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import axios from 'axios';
import './add.css';

const Add = ({ onClose}) => {
     const { register, handleSubmit } = useForm();

     const notyf = new Notyf({
          position: {
               x: 'center',
               y: 'top',
          },
     });

    const addData = (data) => {
        axios.post('http://localhost:3005/api/add', data)
            .then(response => {
                 onClose();
                 // Обновление текущей страницы
                 window.location.reload();

                 notyf.success("Успешно");
                 
            })
            .catch(error => {
                console.error(error);
                notyf.error("Ошибка при отправке данных");
            });
    };


     return (
          <div className='modal'>
               <div className="modal-content">
                    <span className='close' onClick={onClose}>
                         &times;
                    </span>
                    <form onSubmit={handleSubmit(addData)} className='modal__form'>
                         <input
                              type="text"
                              name="nomi"
                              placeholder='Гурух номи'
                              {...register("nomi", { required: true })}
                         />
                         <select name="kuni" {...register("kuni", { required: true })}>
                              <option value="">Кунларни танланг</option>
                              <option value="Душанба, Чоршанба, Жума">Жуфт кунлари (Душанба, Чоршанба, Жума)</option>
                              <option value="Сешанба, Пайшанба, Шанба">Ток кунлар (Сешанба, Пайшанба, Шанба)</option>
                         </select>
                    
                         <select name="oqituvchi" {...register("vaqti", { required: true })}>
                              <option value="08:00-10:00">08:00 - 10:00</option>
                              <option value="10:00-12:00">10:00-12:00</option>
                              <option value="12:00-14:00">12:00-14:00</option>
                         </select>
                         <select name="oqituvchi" {...register("oqituvchi", { required: true })}>
                              <option value="">Укитувчи танланг</option>
                              <option value="Али">Али</option>
                              <option value="Бекзод">Бекзод</option>
                              <option value="Дилшод">Дилшод</option>
                         </select>
                         <button type="submit">Гурух яратиш</button>
                    </form>

               </div>
          </div>
     );
}

export default Add;

