# QWeb Booking App

A unified booking platform for Queen's Web Development (QWeb) that combines the best features of Calendly and LettuceMeet into one seamless solution.

## 🚀 Features

### 🔐 User Authentication
- Secure signup and login system
- User profile management
- Firebase Authentication integration

### 📅 Team Meeting Scheduling (LettuceMeet-style)
- Create team meetings with availability polling
- Find the perfect time that works for everyone
- Set response deadlines
- Track participant responses

### 🎯 Interview Scheduling (Calendly-style)
- Professional interview slot creation
- Automated time slot generation
- Easy candidate booking system
- Location and duration management

### 📋 Unified Booking Management
- View all bookings in one place
- Filter by type, status, and date
- Easy management and monitoring
- No more switching between platforms

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Routing**: React Router DOM
- **State Management**: React Context + Hooks

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   ├── calendar/     # Calendar-related components
│   └── layout/       # Layout components (Navbar, etc.)
├── features/
│   ├── auth/         # Authentication logic and context
│   ├── meetings/     # Team meeting functionality
│   ├── interviews/   # Interview scheduling functionality
│   └── bookings/     # Booking management
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── pages/            # Page components
└── styles/           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qweb-booking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `src/lib/firebase.js` with your Firebase config

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your project configuration
6. Update `src/lib/firebase.js`

### Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 📱 Usage

### For Team Leaders
1. **Sign up/Login** to your QWeb account
2. **Create Team Meetings** with availability polling
3. **Share meeting links** with team members
4. **View responses** and find optimal meeting times

### For Interviewers
1. **Create Interview Slots** with specific durations
2. **Set availability windows** (9 AM - 5 PM)
3. **Share booking links** with candidates
4. **Manage bookings** and confirmations

### For All Users
1. **View all bookings** in one unified dashboard
2. **Filter and search** through your schedule
3. **Manage responses** and participant lists
4. **Track deadlines** and upcoming events

## 🎨 Design Philosophy

- **Clean & Modern**: Professional appearance suitable for university clubs
- **Mobile-First**: Responsive design that works on all devices
- **Accessible**: WCAG compliant with proper focus management
- **Fast**: Optimized performance with modern React patterns
- **Intuitive**: Easy-to-use interface that requires minimal training

## 🔒 Security Features

- Firebase Authentication with email/password
- Secure Firestore rules
- User data isolation
- Input validation and sanitization
- Protected routes for authenticated users

## 🚧 Development Roadmap

### Phase 1 ✅ (Current)
- [x] User authentication system
- [x] Team meeting creation and management
- [x] Interview slot creation and booking
- [x] Unified booking dashboard
- [x] Responsive design and mobile support

### Phase 2 🔄 (In Progress)
- [ ] Meeting availability polling interface
- [ ] Interview booking flow for candidates
- [ ] Email notifications and reminders
- [ ] Calendar integration (Google Calendar, Outlook)

### Phase 3 📋 (Planned)
- [ ] Advanced analytics and reporting
- [ ] Team management and permissions
- [ ] API endpoints for external integrations
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **QWeb Team** for the vision and requirements
- **Firebase** for the robust backend infrastructure
- **Tailwind CSS** for the beautiful design system
- **React Team** for the amazing framework

## 📞 Support

For support, email [support@qweb.ca](mailto:support@qweb.ca) or join our [Discord server](https://discord.gg/qweb).

---

**Built with ❤️ by the Queen's Web Development Team**
