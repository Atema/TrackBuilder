import { batch, computed, signal } from "@preact/signals";
import {
  fileAuthor,
  fileName,
  insertPosition,
  locations,
  timeZone,
} from "./locations";

type State = ReturnType<typeof getCurrentState>;

const undoStates = signal<State[]>([]);
const redoStates = signal<State[]>([]);

export const canUndo = computed(() => undoStates.value.length > 0);
export const canRedo = computed(() => redoStates.value.length > 0);

const getCurrentState = () => ({
  locations: locations.value,
  insertPosition: insertPosition.value,
  fileName: fileName.value,
  fileAuthor: fileAuthor.value,
  timeZone: timeZone.value,
});

const restoreState = (state: State) => {
  locations.value = state.locations;
  insertPosition.value = state.insertPosition;
  fileName.value = state.fileName;
  fileAuthor.value = state.fileAuthor;
  timeZone.value = state.timeZone;
};

export const saveUndoState = () => {
  batch(() => {
    undoStates.value = [getCurrentState(), ...undoStates.value];
    redoStates.value = [];
  });
};

export const undo = () => {
  const state = undoStates.value[0];
  if (!state) return;

  batch(() => {
    redoStates.value = [getCurrentState(), ...redoStates.value];
    restoreState(state);
    undoStates.value = undoStates.value.slice(1);
  });
};

export const redo = () => {
  const state = redoStates.value[0];
  if (!state) return;

  batch(() => {
    undoStates.value = [getCurrentState(), ...undoStates.value];
    restoreState(state);
    redoStates.value = redoStates.value.slice(1);
  });
};
