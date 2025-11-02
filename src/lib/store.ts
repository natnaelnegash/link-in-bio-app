import {create} from 'zustand'

type PreviewState = {
    refreshKey : number
    triggerRefresh: () => void
}

export const usePreviewStore = create<PreviewState>((set) => ({
    refreshKey: 0,
    triggerRefresh: () => set((state) => ({refreshKey: state.refreshKey + 1 }))
}))