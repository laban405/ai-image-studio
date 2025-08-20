import { createStore } from "zustand/vanilla";
import { StoreApi, useStore } from "zustand";
import React from "react";
import { persist, createJSONStorage } from "zustand/middleware";

const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = React.createContext(null as any as TStore);

  const Provider = (props: {
    children?: React.ReactNode;
    initialValue: TInitial;
  }) => {
    const [store] = React.useState(getStore(props.initialValue));

    return <Context.Provider value={store}>{props.children}</Context.Provider>;
  };

  return {
    useContext: () => React.useContext(Context),
    Context,
    Provider,
  };
};

export type Layer = {
  projectId: string;
  userId: string;
  publicId?: string;
  width?: number;
  height?: number;
  url?: string;
  _id?: string;
  name?: string;
  format?: string;
  poster?: string;
  resourceType?: string;
  transcriptionURL?: string;
};

type State = {
  id: string;
  name: string;
  user: any;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  layers: Partial<Layer>[];
  addId: (id: string) => void;
  addName: (name: string) => void;
  addUser: (userId: string) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  activeLayer?: Layer;
  updateLayer: (layer: Partial<Layer>) => void;
  setPoster: (id: string, posterUrl: string) => void;
  setTranscription: (id: string, transcriptionURL: string) => void;
  layerComparisonMode: boolean;
  setLayerComparisonMode: (mode: boolean) => void;
  comparedLayers: string[];
  setComparedLayers: (layers: string[]) => void;
  setLayers: (layers: string[]) => void;
  toggleComparedLayer: (id: string) => void;
};

const getStore = (initialState: null) => {
  return createStore<State>()(
    persist(
      (set) => ({
        id: "",
        name: "",
        user: {},
        addId: (id) =>
          set((state) => ({
            id,
          })),
        addName: (name) =>
          set((state) => ({
            name,
          })),
        addUser: (user) =>
          set((state) => ({
            user,
          })),
        setThumbnailUrl: (thumbnailUrl) =>
          set((state) => ({
            thumbnailUrl,
          })),
        layers: [],
        addLayer: (layer) =>
          set((state) => ({
            layers: [...state.layers, { ...layer }],
          })),
        setLayers: (layers: any[]) =>
          set((state) => ({
            layers,
          })),
        removeLayer: (id: string) =>
          set((state) => ({
            layers: state.layers?.filter((l) => l._id !== id),
          })),
        setActiveLayer: (id: string) =>
          set((state: any) => ({
            activeLayer:
              state.layers?.find((l) => l._id === id) || state.layers[0],
          })),
        activeLayer: undefined,
        updateLayer: (layer) =>
          set((state) => ({
            layers: state.layers?.map((l) => (l._id === layer._id ? layer : l)),
          })),
        setPoster: (id: string, posterUrl: string) =>
          set((state) => ({
            layers: state.layers.map((l) =>
              l._id === id ? { ...l, poster: posterUrl } : l
            ),
          })),
        setTranscription: (id: string, transcriptionURL: string) =>
          set((state) => ({
            layers: state.layers.map((l) =>
              l._id === id ? { ...l, transcriptionURL } : l
            ),
          })),
        layerComparisonMode: false,
        setLayerComparisonMode: (mode: boolean) =>
          set(() => ({
            layerComparisonMode: mode,
            comparedLayers: mode ? [] : [],
          })),
        comparedLayers: [],
        setComparedLayers: (layers: string[]) =>
          set(() => ({
            comparedLayers: layers,
            layerComparisonMode: layers.length > 0,
          })),
        toggleComparedLayer: (id: string) =>
          set((state) => {
            const newComparedLayers = state.comparedLayers.includes(id)
              ? state.comparedLayers.filter((layerId) => layerId !== id)
              : [...state.comparedLayers, id].slice(-2);
            return {
              comparedLayers: newComparedLayers,
              layerComparisonMode: newComparedLayers.length > 0,
            };
          }),
      }),
      { name: "layer-storage" }
    )
  );
};

export const ProjectStore = createZustandContext(getStore);

export function useProjectStore<T>(selector: (state: State) => T) {
  const store = React.useContext(ProjectStore.Context);
  if (!store) {
    throw new Error("Missing ProjectStore provider");
  }
  return useStore(store, selector);
}
