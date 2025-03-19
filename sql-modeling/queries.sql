-- create departments table
CREATE TABLE departments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- instructor table
CREATE TABLE instructors (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,
	department_id INT NOT NULL,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

	CONSTRAINT fk_instructor_department
	FOREIGN KEY (department_id)
	REFERENCES departments(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- students table
CREATE TABLE students (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL UNIQUE,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- RENAME TABLE courses TO students;
-- ALTER TABLE courses RENAME TO students;

-- create courses table
CREATE TABLE courses (
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	instructor_id INT NOT NULL,
	department_id INT NOT NULL,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	CONSTRAINT fk_courses_instructor
	FOREIGN KEY (instructor_id)
	REFERENCES instructors(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,

	CONSTRAINT fk_courses_department
	FOREIGN KEY (department_id)
	REFERENCES deparments(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- create enrollments table
CREATE TABLE enrollments (
	student_id INT NOT NULL,
	course_id INT NOT NULL,

	PRIMARY KEY (student_id, course_id),

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	CONSTRAINT fk_enrollement_student
	FOREIGN KEY (student_id)
	REFERENCES students(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,

	CONSTRAINT fk_enrollments_course
	FOREIGN KEY (course_id)
	REFERENCES courses(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);


-- create assignments table
CREATE TABLE assignments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	course_id INT NOT NULL,
	title VARCHAR(255) NOT NULL,

	CONSTRAINT fk_assignment_course
	FOREIGN KEY (course_id)
	REFERENCES courses(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- add columns to assignments table
ALTER TABLE assignments
ADD COLUMN 	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- add syllabus column to courses table
ALTER TABLE courses
ADD COLUMN syllabus TEXT NOT NULL
AFTER name;


-- Seed the data

-- departments
INSERT INTO departments (name, created_at, updated_at)
VALUES
('Department 1', NOW(), NOW()),
('Department 2', NOW(), NOW()),
('Department 3', NOW(), NOW()),
('Department 4', NOW(), NOW()),
('Department 5', NOW(), NOW()),
('Department 6', NOW(), NOW()),
('Department 7', NOW(), NOW()),
('Department 8', NOW(), NOW()),
('Department 9', NOW(), NOW()),
('Department 10', NOW(), NOW()),
('Department 11', NOW(), NOW()),
('Department 12', NOW(), NOW()),
('Department 13', NOW(), NOW()),
('Department 14', NOW(), NOW()),
('Department 15', NOW(), NOW()),
('Department 16', NOW(), NOW()),
('Department 17', NOW(), NOW()),
('Department 18', NOW(), NOW()),
('Department 19', NOW(), NOW()),
('Department 20', NOW(), NOW());

-- instructors
INSERT INTO instructors (name, email, department_id, created_at, updated_at)
VALUES
('Instructor 1',  'instructor1@example.com',  1,  NOW(), NOW()),
('Instructor 2',  'instructor2@example.com',  2,  NOW(), NOW()),
('Instructor 3',  'instructor3@example.com',  3,  NOW(), NOW()),
('Instructor 4',  'instructor4@example.com',  4,  NOW(), NOW()),
('Instructor 5',  'instructor5@example.com',  5,  NOW(), NOW()),
('Instructor 6',  'instructor6@example.com',  6,  NOW(), NOW()),
('Instructor 7',  'instructor7@example.com',  7,  NOW(), NOW()),
('Instructor 8',  'instructor8@example.com',  8,  NOW(), NOW()),
('Instructor 9',  'instructor9@example.com',  9,  NOW(), NOW()),
('Instructor 10', 'instructor10@example.com', 10, NOW(), NOW()),
('Instructor 11', 'instructor11@example.com', 11, NOW(), NOW()),
('Instructor 12', 'instructor12@example.com', 12, NOW(), NOW()),
('Instructor 13', 'instructor13@example.com', 13, NOW(), NOW()),
('Instructor 14', 'instructor14@example.com', 14, NOW(), NOW()),
('Instructor 15', 'instructor15@example.com', 15, NOW(), NOW()),
('Instructor 16', 'instructor16@example.com', 16, NOW(), NOW()),
('Instructor 17', 'instructor17@example.com', 17, NOW(), NOW()),
('Instructor 18', 'instructor18@example.com', 18, NOW(), NOW()),
('Instructor 19', 'instructor19@example.com', 19, NOW(), NOW()),
('Instructor 20', 'instructor20@example.com', 20, NOW(), NOW());

-- students
INSERT INTO students (name, email, created_at, updated_at)
VALUES
('Student 1',  'student1@example.com',  NOW(), NOW()),
('Student 2',  'student2@example.com',  NOW(), NOW()),
('Student 3',  'student3@example.com',  NOW(), NOW()),
('Student 4',  'student4@example.com',  NOW(), NOW()),
('Student 5',  'student5@example.com',  NOW(), NOW()),
('Student 6',  'student6@example.com',  NOW(), NOW()),
('Student 7',  'student7@example.com',  NOW(), NOW()),
('Student 8',  'student8@example.com',  NOW(), NOW()),
('Student 9',  'student9@example.com',  NOW(), NOW()),
('Student 10', 'student10@example.com', NOW(), NOW()),
('Student 11', 'student11@example.com', NOW(), NOW()),
('Student 12', 'student12@example.com', NOW(), NOW()),
('Student 13', 'student13@example.com', NOW(), NOW()),
('Student 14', 'student14@example.com', NOW(), NOW()),
('Student 15', 'student15@example.com', NOW(), NOW()),
('Student 16', 'student16@example.com', NOW(), NOW()),
('Student 17', 'student17@example.com', NOW(), NOW()),
('Student 18', 'student18@example.com', NOW(), NOW()),
('Student 19', 'student19@example.com', NOW(), NOW()),
('Student 20', 'student20@example.com', NOW(), NOW());

-- courses
INSERT INTO courses (name, instructor_id, department_id, syllabus, created_at, updated_at)
VALUES
('Course 1',  1,  1,  'Syllabus for Course 1',  NOW(), NOW()),
('Course 2',  2,  2,  'Syllabus for Course 2',  NOW(), NOW()),
('Course 3',  3,  3,  'Syllabus for Course 3',  NOW(), NOW()),
('Course 4',  4,  4,  'Syllabus for Course 4',  NOW(), NOW()),
('Course 5',  5,  5,  'Syllabus for Course 5',  NOW(), NOW()),
('Course 6',  6,  6,  'Syllabus for Course 6',  NOW(), NOW()),
('Course 7',  7,  7,  'Syllabus for Course 7',  NOW(), NOW()),
('Course 8',  8,  8,  'Syllabus for Course 8',  NOW(), NOW()),
('Course 9',  9,  9,  'Syllabus for Course 9',  NOW(), NOW()),
('Course 10', 10, 10, 'Syllabus for Course 10', NOW(), NOW()),
('Course 11', 11, 11, 'Syllabus for Course 11', NOW(), NOW()),
('Course 12', 12, 12, 'Syllabus for Course 12', NOW(), NOW()),
('Course 13', 13, 13, 'Syllabus for Course 13', NOW(), NOW()),
('Course 14', 14, 14, 'Syllabus for Course 14', NOW(), NOW()),
('Course 15', 15, 15, 'Syllabus for Course 15', NOW(), NOW()),
('Course 16', 16, 16, 'Syllabus for Course 16', NOW(), NOW()),
('Course 17', 17, 17, 'Syllabus for Course 17', NOW(), NOW()),
('Course 18', 18, 18, 'Syllabus for Course 18', NOW(), NOW()),
('Course 19', 19, 19, 'Syllabus for Course 19', NOW(), NOW()),
('Course 20', 20, 20, 'Syllabus for Course 20', NOW(), NOW());

-- enrollements
INSERT INTO enrollments (student_id, course_id, created_at, updated_at)
VALUES
(1,  1,  NOW(), NOW()),
(2,  2,  NOW(), NOW()),
(3,  3,  NOW(), NOW()),
(4,  4,  NOW(), NOW()),
(5,  5,  NOW(), NOW()),
(6,  6,  NOW(), NOW()),
(7,  7,  NOW(), NOW()),
(8,  8,  NOW(), NOW()),
(9,  9,  NOW(), NOW()),
(10, 10, NOW(), NOW()),
(11, 11, NOW(), NOW()),
(12, 12, NOW(), NOW()),
(13, 13, NOW(), NOW()),
(14, 14, NOW(), NOW()),
(15, 15, NOW(), NOW()),
(16, 16, NOW(), NOW()),
(17, 17, NOW(), NOW()),
(18, 18, NOW(), NOW()),
(19, 19, NOW(), NOW()),
(20, 20, NOW(), NOW());

-- assignments
INSERT INTO assignments (course_id, title, created_at, updated_at)
VALUES
(1,  'Assignment for Course 1',   NOW(), NOW()),
(2,  'Assignment for Course 2',   NOW(), NOW()),
(3,  'Assignment for Course 3',   NOW(), NOW()),
(4,  'Assignment for Course 4',   NOW(), NOW()),
(5,  'Assignment for Course 5',   NOW(), NOW()),
(6,  'Assignment for Course 6',   NOW(), NOW()),
(7,  'Assignment for Course 7',   NOW(), NOW()),
(8,  'Assignment for Course 8',   NOW(), NOW()),
(9,  'Assignment for Course 9',   NOW(), NOW()),
(10, 'Assignment for Course 10',  NOW(), NOW()),
(11, 'Assignment for Course 11',  NOW(), NOW()),
(12, 'Assignment for Course 12',  NOW(), NOW()),
(13, 'Assignment for Course 13',  NOW(), NOW()),
(14, 'Assignment for Course 14',  NOW(), NOW()),
(15, 'Assignment for Course 15',  NOW(), NOW()),
(16, 'Assignment for Course 16',  NOW(), NOW()),
(17, 'Assignment for Course 17',  NOW(), NOW()),
(18, 'Assignment for Course 18',  NOW(), NOW()),
(19, 'Assignment for Course 19',  NOW(), NOW()),
(20, 'Assignment for Course 20',  NOW(), NOW());