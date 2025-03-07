import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Note {
  date: string;
  subject: string;
  note: string;
  favorite: boolean;
  isEditing?: boolean;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  searchText: string = '';
  newNote: Note = {
    date: new Date().toLocaleDateString(),
    subject: '',
    note: '',
    favorite: false
  };
  isEditing: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Load notes from localStorage if any exist
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  addNote(): void {
    if (this.newNote.subject.trim() || this.newNote.note.trim()) {
      this.notes.unshift({...this.newNote});
      this.saveNotes();
      this.resetNewNote();
      this.isEditing = false;
    }
  }

  deleteNote(index: number): void {
    this.notes.splice(index, 1);
    this.saveNotes();
  }

  toggleFavorite(index: number): void {
    this.notes[index].favorite = !this.notes[index].favorite;
    this.saveNotes();
  }

  startEditing(): void {
    this.isEditing = true;
  }

  discardNote(): void {
    this.resetNewNote();
    this.isEditing = false;
  }

  editNote(index: number): void {
    // Reset any other note that might be in edit mode
    this.notes.forEach(note => note.isEditing = false);
    this.notes[index].isEditing = true;
  }

  saveEditedNote(index: number): void {
    if (this.notes[index].subject.trim() || this.notes[index].note.trim()) {
      this.notes[index].isEditing = false;
      this.saveNotes();
    }
  }

  cancelEdit(index: number): void {
    // Reload the notes from localStorage to revert changes
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  private saveNotes(): void {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }

  private resetNewNote(): void {
    this.newNote = {
      date: new Date().toLocaleDateString(),
      subject: '',
      note: '',
      favorite: false
    };
  }

  get filteredNotes(): Note[] {
    return this.notes.filter(note =>
      note.subject.toLowerCase().includes(this.searchText.toLowerCase()) ||
      note.note.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
} 