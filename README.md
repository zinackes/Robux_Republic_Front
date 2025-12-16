![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

## 📋 Description du Projet

Ce projet concerne le développement **Frontend** d'une application bancaire moderne nommée "Robux Republic".
L'objectif est d'implémenter l'interface utilisateur et la logique métier bancaire (comptes, transactions, bénéficiaires) avec des appels API de notre backend.

Le projet met l'accent sur la réalisation technique des User Stories définies pour la gestion de comptes bancaires Virtuels (Robux).

---

## ✨ Fonctionnalités Clés

Ce projet couvre un large éventail de User Stories (US) pour offrir une expérience complète :

### 💳 Gestion de Comptes (Account Management)
- **Vue d'ensemble (Story 9)** : Dashboard unifié affichant tous les comptes (Principal, Secondaire).
- **Création de compte (Story 8)** : Interface modale fluide pour ouvrir un nouveau compte en quelques clics.
- **Clôture de compte (Story 10)** : Processus sécurisé pour fermer un compte existant.
- **Détails & Sécurité** : Visualisation détaillée, clôture de compte, et plafonds de dépenses.

### 💸 Transactions & Opérations
- **Virements & Dépôts** : Interface unifiée pour effectuer des virements ou déposer de l'argent (Espèces/Chèque).
- **Historique Détaillé (Story 11)** : Liste complète des transactions avec recherche, filtrage et détails précis (émetteur, montant, date, nom).
- **Reçus & Documents (Story 14)** : Génération et téléchargement de relevés de compte (PDF).

### 👥 Gestion des Bénéficiaires
- **Annuaire (Story 12)** : Visualisation des bénéficiaires sous forme de cartes d'identité futuristes.
- **Ajout de contact (Story 13)** : Formulaire intuitif pour ajouter un nouveau bénéficiaire (IBAN, Nom).
- **Flux intégré (Story 15)** : Possibilité d'ajouter un bénéficiaire à la volée directement lors d'un virement.

### 🎨 UI & Expérience Utilisateur
- **Dark Mode 🌙** : Un thème sombre élégant natif pour réduire la fatigue visuelle.
- **Sécurité Transactionnelle** : Système de compte à rebours "Undo" (5s) avant validation d'un virement.
- **Visualisations** : Graphiques Sparklines pour l'historique des soldes.
- **Sound Design 🔊** : Effets sonores immersifs lors de certaines actions clés (validation, erreurs).

---

## ⚙️ Installation Frontend

Suivez ces étapes pour installer et lancer l'interface utilisateur localement :

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-equipe/robux-republic_front.git
   cd robux-republic
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible à l'adresse : `http://localhost:5173`

---

## 🔙 Installation Backend (API)

Le backend se trouve dans un autre dépôt (ou dossier séparé). Voici la procédure pour l'installer et lancer les services nécessaires.

### 1. Cloner et préparer l'environnement

```bash
# Cloner le dépôt backend
git clone https://github.com/zinackes/Robux_Republic.git

# Accéder au dossier du projet
cd Robux_Republic_Backend
```

### 2. Configurer l'environnement virtuel (.venv)

Créez l'environnement virtuel avec la commande exacte :
```bash
python3 -m venv .venv
```

Ensuite, activez-le :

*   **Sous Windows :**
    ```bash
    .venv\Scripts\activate
    ```

*   **Sous Mac / Linux :**
    ```bash
    source .venv/bin/activate
    ```

### 3. Installer les dépendances

Une fois l'environnement activé :
```bash
pip install -r requirements.txt
```

### 4. Démarrer l'API

```bash
fastapi dev app/main.py
```

### 5. Lancer les Tâches Planifiées (Schedulers)

Pour que l'application fonctionne correctement (validation des transactions, emails), vous devez lancer ces scripts dans des **terminaux séparés** (en vous assurant d'être toujours dans le dossier du backend avec le `.venv` activé).

**Terminal A : Finalisation des transactions**
```bash
python -m app.schelduler.finalize_transaction
```

**Terminal B : Service d'envoi d'emails**
```bash
python -m app.schelduler.mail_send
```

---

## 👥 Membres du Projet

| Nom | Rôle | GitHub |
| :--- | :--- | :--- |
| **Mathys Sclafer** | Développeur | [@zinackes](https://github.com/zinackes) |
| **Inès Charfi** | Développeur | [@djelines](https://github.com/djelines) |
| **Clement Seurin le Goffic** | Développeur | [@Cl3m3nt03](https://github.com/Cl3m3nt03) |
| **Matéis Bourlet** | Développeur | [@BourletMateis](https://github.com/BourletMateis) |

---

## 📄 Licence

Ce projet est sous licence **MIT**.
