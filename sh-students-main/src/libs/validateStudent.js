export function findStudentByFileNumber(students, targetFileNumber) {
	for (const student of students) {
		if (student.file_number === targetFileNumber && student.status === true) {
			return true;
		}
	}
	return false;
}
