import { createApp } from 'vue';
import { createSongUI } from '@song-ui/vue';
import '@song-ui/vue/styles';
import App from './App.vue';
import SongOfficialSite from './components/SongOfficialSite.vue';

const isSongDemo = new URLSearchParams(window.location.search).get('demo') === 'song';
const app = createApp(isSongDemo ? SongOfficialSite : App);
app.use(createSongUI({ theme: 'dark', sound: true }));
app.mount('#app');
