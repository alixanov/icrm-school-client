import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Container from "../components/container/Container";
import StudentsTable from "../components/students-table/StudentsTable";
import AttendanceTable from "../components/attendance/AttendanceTable";
import AttendanceLog from '../components/attendancelog/AttendanceLog';  // Импортируем компонент журнала

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Container />} />
        <Route path="/students/:groupId" element={<StudentsTable />} />
        <Route path="/attendance/:groupId" element={<AttendanceTable />} />
        <Route path="/attendance-log/:groupId" element={<AttendanceLog />} />  {/* Добавляем маршрут с groupId */}
      </Routes>
    </>
  );
};

export default AppRoutes;
