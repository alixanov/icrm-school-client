import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';  // Импортируем DatePicker для выбора даты
import 'react-datepicker/dist/react-datepicker.css';
import './attencance.css';
import { ToastContainer, toast } from 'react-toastify';  // Импортируем ToastContainer и функцию toast
import 'react-toastify/dist/ReactToastify.css';  // Импортируем стили для Toastify
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const AttendanceTable = () => {
  const { groupId } = useParams();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());  // Дата по умолчанию — сегодня
  const navigate = useNavigate()
  
  // Получение списка студентов для группы
  useEffect(() => {
    axios.get(`https://crm-school-server.vercel.app/api/students/${groupId}`)
      .then(response => {
        setStudents(response.data);
        const initialAttendance = response.data.map(student => ({
          studentId: student._id,
          status: 'absent',  // Статус по умолчанию
        }));
        setAttendance(initialAttendance);
      })
      .catch(error => {
        console.error('Ошибка при получении студентов:', error);
        toast.error('Ошибка при получении студентов');
      });
  }, [groupId]);

  // Обновление статуса посещаемости
  const handleStatusChange = (studentId, status) => {
    const updatedAttendance = attendance.map(record =>
      record.studentId === studentId ? { ...record, status } : record
    );
    setAttendance(updatedAttendance);
  };

  // Отправка данных посещаемости на сервер
  const handleSubmitAttendance = () => {
    axios.post('https://crm-school-server.vercel.app/api/attendance', {
      groupId,
      date: selectedDate,  // Передаем выбранную дату
      records: attendance,
    })
      .then(() => {
        toast.success('Посещаемость сохранена успешно!');  // Показ уведомления об успехе
      })
      .catch(error => {
        console.error('Ошибка при сохранении посещаемости:', error);
        toast.error('Ошибка при сохранении посещаемости');  // Показ уведомления об ошибке
      });
  };

  return (
    <div className="attendance-container">
      <div className="date-picker">
        < ArrowBackIosIcon onClick={() => navigate('/')} />

        <label>Санани танланг: </label>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}  // Устанавливаем выбранную дату
          dateFormat="dd/MM/yyyy"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Ф.И.Ш</th>
            <th>Статуси</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>
                <select
                  value={attendance.find(record => record.studentId === student._id)?.status || 'absent'}
                  onChange={e => handleStatusChange(student._id, e.target.value)}
                >
                  <option value="present">Келмади</option>
                  <option value="absent">Келди</option>
                  <option value="late">Кеч колди</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className='btn__save-date' onClick={handleSubmitAttendance}>Давоматни саклаш</button>

      <ToastContainer />  {/* Компонент для отображения уведомлений */}
    </div>
  );
};

export default AttendanceTable;
