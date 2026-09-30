export interface Participant {
  name: string;
  department: string;
  startedAt: string;
}

export interface CardItem {
  id: string;
  code?: string;
  title: string;
  description: string;
  systemOrigin?: string;
}

export interface GroupContainer {
  id: string;
  name: string;
  createdAt: string;
}

export interface CardSortingState {
  participant: Participant | null;
  groups: GroupContainer[];
  // Mapping of containerId ('unassigned' or groupId) to array of card IDs
  items: Record<string, string[]>;
  cards: Record<string, CardItem>;
}

export interface CardSortingSubmission {
  id?: string;
  participant_name: string;
  participant_department: string;
  submitted_at: string;
  summary: {
    total_cards: number;
    total_groups: number;
    assigned_cards: number;
    unassigned_cards: number;
    assigned_percentage: number;
  };
  structure_payload: {
    groups: Array<{
      group_id: string;
      group_name: string;
      cards: Array<{
        id: string;
        code?: string;
        title: string;
      }>;
    }>;
    unassigned_cards: Array<{
      id: string;
      code?: string;
      title: string;
    }>;
  };
}
