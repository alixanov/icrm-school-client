import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, useParams } from 'react-router-dom';  // Используем useParams для доступа к параметру groupId
import "./attencance-log.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const AttendanceLog = () => {
     const { groupId } = useParams();  // Получаем groupId из URL
     const [selectedDate, setSelectedDate] = useState(new Date());  // По умолчанию сегодня
     const [attendanceRecords, setAttendanceRecords] = useState([]);  // Массив для хранения данных посещаемости
     const [loading, setLoading] = useState(false);  // Для отображения загрузки
     const navigate = useNavigate()

     // Функция для получения посещаемости на выбранную дату
     const fetchAttendance = () => {
          setLoading(true);  // Устанавливаем состояние загрузки
          const formattedDate = selectedDate.toISOString().split('T')[0];  // Форматируем дату в строку "YYYY-MM-DD"

          axios.get(`http://localhost:3005/api/attendance?groupId=${groupId}&date=${formattedDate}`)
               .then(response => {
                    setAttendanceRecords(response.data);  // Сохраняем данные о посещаемости в state
               })
               .catch(error => {
                    console.error('Ошибка при получении данных посещаемости:', error);
               })
               .finally(() => {
                    setLoading(false);  // Отключаем состояние загрузки
               });
     };

     return (
          <div className="attendance-log-container">
               <div className="title__attendance-log">
                    < ArrowBackIosIcon onClick={() => navigate('/')} />
                    <h2>Ушбу давомат журнали {selectedDate.toLocaleDateString()} сананики</h2>


             </div>
               {/* Выбор даты */}
               <div className="date-picker">
                    <label>Санани танланг: </label>
                    <DatePicker
                         selected={selectedDate}
                         onChange={date => setSelectedDate(date)}  // Обновляем выбранную дату
                         dateFormat="dd/MM/yyyy"
                    />
                    <div className="btn__search">
                         <button className='btn__search' onClick={fetchAttendance}>Излаш</button>  {/* Нажатие вызывает fetchAttendance */}
                    </div>
               </div>

               {/* Таблица посещаемости */}
               {loading ? (
                    <p>Загрузка...</p>  // Пока данные загружаются, отображаем индикатор загрузки
               ) : (
                    <table>
                         <thead>
                              <tr>
                                   <th>Ф.И.Ш</th>
                                   <th>Группа</th>
                                   <th>Статуси</th>
                              </tr>
                         </thead>
                              <tbody>
                                   {attendanceRecords.length > 0 ? (
                                        attendanceRecords.map(record => (
                                             <tr key={record._id}>
                                                  <td>{record.studentId?.name || 'Имя не найдено'}</td>  {/* Отображаем имя студента */}
                                                  <td>{record.groupId?.nomi || 'Группа не найдена'}</td>  {/* Отображаем название группы */}
                                                  <td>{record.status === 'present' ? 'Присутствует' : record.status === 'absent' ? 'Отсутствует' : 'Опоздал'}</td>
                                             </tr>
                                        ))
                                   ) : (
                                        <tr>
                                             <td colSpan="3">Ушбу санада малумот топилмади</td>
                                        </tr>
                                   )}
                              </tbody>

                    </table>
               )}
          </div>
     );
};

export default AttendanceLog;
