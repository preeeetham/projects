import { create } from 'zustand';
import { PublicRecord } from '@/types';

interface RecordsStore {
  records: PublicRecord[];
  selectedRecord: PublicRecord | null;
  setRecords: (records: PublicRecord[]) => void;
  setSelectedRecord: (record: PublicRecord | null) => void;
  addRecord: (record: PublicRecord) => void;
  updateRecord: (id: string, record: Partial<PublicRecord>) => void;
  deleteRecord: (id: string) => void;
}

export const useRecordsStore = create<RecordsStore>((set) => ({
  records: [],
  selectedRecord: null,
  setRecords: (records) => set({ records }),
  setSelectedRecord: (record) => set({ selectedRecord: record }),
  addRecord: (record) =>
    set((state) => ({
      records: [record, ...state.records],
    })),
  updateRecord: (id, updatedData) =>
    set((state) => ({
      records: state.records.map((r) =>
        r.id === id ? { ...r, ...updatedData } : r
      ),
      selectedRecord:
        state.selectedRecord?.id === id
          ? { ...state.selectedRecord, ...updatedData }
          : state.selectedRecord,
    })),
  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      selectedRecord:
        state.selectedRecord?.id === id ? null : state.selectedRecord,
    })),
}));
