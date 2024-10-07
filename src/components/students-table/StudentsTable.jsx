import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import './students-table.css';
import 'react-datepicker/dist/react-datepicker.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const StudentsTable = () => {
     const { groupId } = useParams();
     const [students, setStudents] = useState([]);
     const [newStudent, setNewStudent] = useState({ name: '', dateOfBirth: null, phonenumber: '' });
     const [editStudent, setEditStudent] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
     const navigate = useNavigate();

     // Получение списка студентов для группы
     useEffect(() => {
          axios.get(`https://crm-school-server.vercel.app/api/students/${groupId}`)
               .then(response => {
                    setStudents(response.data);
               })
               .catch(error => {
                    console.error('Ошибка при получении учеников:', error);
               });
     }, [groupId]);

     const handleAddStudent = (e) => {
          e.preventDefault();

          const studentData = {
               name: newStudent.name,
               dateOfBirth: newStudent.dateOfBirth,  // Используем dateOfBirth
               phonenumber: newStudent.phonenumber,
               groupId: groupId
          };

          axios.post('https://crm-school-server.vercel.app/api/students', studentData)
               .then(response => {
                    setStudents([...students, response.data]);
                    setNewStudent({ name: '', dateOfBirth: null, phonenumber: '' });
                    setIsModalOpen(false);
               })
               .catch(error => {
                    console.error('Ошибка при добавлении ученика:', error);
               });
     };

     // Открытие модального окна для редактирования
     const handleEditClick = (student) => {
          setEditStudent(student);
          setIsModalOpen(true);
     };

     // Функция обновления студента
     const handleUpdateStudent = (e) => {
          e.preventDefault();

          const updatedStudent = {
               name: editStudent.name,
               dateOfBirth: editStudent.dateOfBirth,  // Используем dateOfBirth
               phonenumber: editStudent.phonenumber,
               groupId: groupId
          };

          axios.put(`https://crm-school-server.vercel.app/students/${editStudent._id}`, updatedStudent)
               .then(response => {
                    setStudents(students.map(student =>
                         student._id === editStudent._id ? response.data : student
                    ));
                    setEditStudent(null);
                    setIsModalOpen(false);
               })
               .catch(error => {
                    console.error('Ошибка при обновлении ученика:', error);
               });
     };

     // Функция удаления студента
     const handleDeleteStudent = (id) => {
          axios.delete(`https://crm-school-server.vercel.app/api/students/${id}`)
               .then(() => {
                    setStudents(students.filter(student => student._id !== id));
               })
               .catch(error => {
                    console.error('Ошибка при удалении ученика:', error);
               });
     };

     return (
          <div className='table__container'>
               <div className="title__students">
                    < ArrowBackIosIcon onClick={() => navigate('/')} />
                    <div className="table__title-btn">
                         <Link className="attendance-link" to={`/attendance/${groupId}`}>Дамомат</Link>
                         <Link className="attendance-log" to={`/attendance-log/${groupId}`}>Давомат журнали</Link>
                    </div>
               </div>

               <div className="table__student">
                    <table>
                         <thead>
                              <tr>
                                   <th>Ф.И.Ш</th>
                                   <th>Тугилган санаси</th>
                                   <th>Богланиш раками</th>
                                   <th>Группа</th>  {/* Добавляем колонку для названия группы */}
                                   <th>Тахрирлаш</th>
                                   <th>Ўчириш</th>
                              </tr>
                         </thead>
                         <tbody>
                              {students.map(student => (
                                   <tr key={student._id}>
                                        <td>{student.name}</td>
                                        <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : ''}</td>
                                        <td>{student.phonenumber}</td>
                                        <td>{student.groupId?.nomi || 'Группа не найдена'}</td>  {/* Отображаем название группы */}
                                        <td>
                                             <button className='create__btn' onClick={() => handleEditClick(student)}>Тахрирлаш</button>
                                        </td>
                                        <td>
                                             <button className='delete__btn' onClick={() => handleDeleteStudent(student._id)}>Ўчириш</button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>

                    </table>

                    <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
                         Қўшиш
                    </button>
               </div>

               {/* Модальное окно для добавления или редактирования студента */}
               {isModalOpen && (
                    <div className="modal-overlay">
                         <div className="modal__content">
                              <h3>{editStudent ? 'Тахрирлаш' : 'Қўшиш'}</h3>
                              <form onSubmit={editStudent ? handleUpdateStudent : handleAddStudent}>
                                   <input
                                        type="text"
                                        placeholder="Ф.И.Ш"
                                        value={editStudent ? editStudent.name : newStudent.name}
                                        onChange={(e) => editStudent
                                             ? setEditStudent({ ...editStudent, name: e.target.value })
                                             : setNewStudent({ ...newStudent, name: e.target.value })}
                                        required
                                   />
                                   <DatePicker
                                        selected={editStudent ? new Date(editStudent.dateOfBirth) : newStudent.dateOfBirth}
                                        onChange={(date) => editStudent
                                             ? setEditStudent({ ...editStudent, dateOfBirth: date })
                                             : setNewStudent({ ...newStudent, dateOfBirth: date })}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Тугилган санаси"
                                        required
                                   />

                                   <input
                                        type="number"
                                        placeholder="Телефон раками"
                                        value={editStudent ? editStudent.phonenumber : newStudent.phonenumber}
                                        onChange={(e) => editStudent
                                             ? setEditStudent({ ...editStudent, phonenumber: e.target.value })
                                             : setNewStudent({ ...newStudent, phonenumber: e.target.value })}
                                        required
                                   />
                                   <div className="modal-actions">
                                        <button type="submit">{editStudent ? 'Янгилаш' : 'Қўшиш'}</button>
                                        <button type="button" onClick={() => { setIsModalOpen(false); setEditStudent(null); }}>
                                             Бекор қилиш
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default StudentsTable;
