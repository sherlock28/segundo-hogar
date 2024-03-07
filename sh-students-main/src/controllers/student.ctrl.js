import { HttpStatusCode } from '../const/statusCode.js';
import { serviceResponse } from "../libs/serviceResponse.js";
import { findStudentByFileNumber } from "../libs/validateStudent.js";
import studentsData from "../data/students.json" assert { type: "json" };

class StudentController {

	isValidStudent(req, res) {
		const students = studentsData.students;
		const targetFileNumber = req.body.file_number;
		let msg=null;

		const isValidStudent = {
			isValidStudent: findStudentByFileNumber(students, targetFileNumber)
		};
		if (isValidStudent.isValidStudent == true) {
			msg="Student is Valid";
		} else {
			msg="Student is Invalid"
		}

		return res.status(HttpStatusCode.OK).json(serviceResponse({ data: isValidStudent, success: true, message:msg, error: null }));
	}
}

export const studentCtrl = new StudentController();
