import { create } from 'zustand';

let controllerId = 1;

const useControllersStore = create(set => ({
  controllers: [],
  // controllers: [{ id: controllerId++, source: null, destination: null}],
  addController: () => set(state => ({
    controllers: [...state.controllers, { id: controllerId++, source: null, destination: null }]
  })),
  removeController: (idToRemove) => set(state => ({
    controllers: state.controllers.filter(controller => controller.id !== idToRemove)
  })),
  setControllerData: (id, data) => set(state => ({
    controllers: state.controllers.map(controller =>
      controller.id === id ? { ...controller, ...data } : controller
    )
  })),
}));

export default useControllersStore;
