import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
server:{
    port:8080
},
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'views/dashboard.html'),
        conseiller: resolve(__dirname, 'views/conseiller.html'),
        depense: resolve(__dirname, 'views/depense.html'),
        login: resolve(__dirname, 'views/login.html'),
        objectif: resolve(__dirname, 'views/objectif.html'),
        Obligation_financiere: resolve(__dirname, 'views/Obligation_financiere.html'),
        profil: resolve(__dirname, 'views/profil.html'),
        revenu: resolve(__dirname, 'views/revenu.html'),
        signIn: resolve(__dirname, 'views/signIn.html'),
        parametres:resolve(__dirname,'views/parametre.html'),
      }
    }
  },
  css:{
    preprocessorOptions:{
        scss:{
            silenceDeprecations:[
                'import',
                'mixed-decls',
                'color-functions',
                'global-builtin',
            ]
        }
    }
  }
  
})
