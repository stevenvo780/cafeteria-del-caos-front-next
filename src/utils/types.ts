export interface AuthData {
  email: string;
  password: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}

export interface User extends SharedProp {
  id: string;
  email: string;
  name?: string | undefined | null;
  role: UserRole; 
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}

export enum Repetition {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FIFTEEN_DAYS = 'fifteen_days',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}
export interface Events extends SharedProp {
  id?: number | null;
  title: string;
  description: string;
  eventDate: Date;
  startDate: Date;
  endDate: Date;
  author?: User;
  repetition?: Repetition;
}

export interface CreateEventDto {
  title: string;
  description: string;
  eventDate: string;
  startDate: string;
  endDate: Date;
  repetition?: Repetition;
}

export interface CalendarEvent {
  id?: number | null;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  url?: string;
  classNames?: string[];
  editable?: boolean;
  extendedProps?: {
    description?: string;
  };
}

export enum LibraryVisibility {
  GENERAL = 'general',
  USERS = 'users',
  ADMIN = 'admin',
}

export interface Library extends SharedProp {
  id: number;
  title: string;
  description: string;
  referenceDate: Date;
  author?: User;
  parent?: Library;
  children?: Library[];
  visibility: LibraryVisibility;
}

export enum TemplateType {
  NOTES = 'Notes',
  EVENTS = 'Events',
  PUBLICATIONS = 'Publications',
  OTHERS = 'Others',
}

export interface Template extends SharedProp {
  id: number;
  name: string;
  type: TemplateType;
  content: string;
}

export interface CreateLibraryDto {
  title: string;
  description: string;
  referenceDate: Date;
  parentNoteId?: number;
  visibility: LibraryVisibility;
}

export interface UpdateLibraryDto {
  title?: string;
  description?: string;
  referenceDate?: Date;
  parentNoteId?: number;
  visibility?: LibraryVisibility;
}

export interface Publication extends SharedProp {
  id: number;
  title: string;
  content: string;
  author?: User;
}

export enum LikeTarget {
  LIBRARY = 'library',
  PUBLICATION = 'publication',
  EVENT = 'event',
}

export interface Like {
  id: number;
  isLike: boolean;
  targetType: LikeTarget;
  targetId: number;
  user: User;
}

export interface CreatePublicationDto {
  title: string;
  content: string;
}

export interface  SharedProp {
  createdAt?: string;
  updatedAt?: string;
}

export interface RouteApi {
  method: string;
  path: string;
}

export interface ResponseData {
  userData: User;
  access_token: string;
}


