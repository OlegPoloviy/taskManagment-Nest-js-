import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { CreateLessonInput } from './lesson.input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
  ) {}

  createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    try {
      const lesson = this.lessonRepository.create({
        id: uuid(),
        name,
        startDate,
        endDate,
        students: [],
      });
      return this.lessonRepository.save(lesson);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getLesson(id: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new Error(`Lesson with id ${id} not found`);
    }
    return lesson;
  }

  async getLessons(): Promise<Lesson[]> {
    try {
      return this.lessonRepository.find();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async asignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    if (!lesson) {
      throw new Error(`Lesson with id ${lessonId} not found`);
    }
    lesson.students = [...lesson.students, ...studentIds];
    return this.lessonRepository.save(lesson);
  }
}
