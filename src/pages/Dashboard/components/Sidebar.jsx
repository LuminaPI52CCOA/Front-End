import {
  Calendar,
  Users,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import logoLumina from "../../../assets/logoLumina.png";

const navItems = [
  { icon: Calendar, label: "Agenda" },
  { icon: Users, label: "Pacientes" },
  { icon: UserPlus, label: "Dentistas" },
  { icon: LayoutDashboard, label: "Dashboard" },
];

export default function Sidebar({ activeItem = "Dashboard" }) {
  return (
    <aside className="flex flex-col w-[220px] min-h-screen bg-white shrink-0">
      {/* Logo — apenas a imagem, o texto já vem embutido no asset */}
      <div className="flex flex-col items-center py-8 px-4">
        <img
          src={logoLumina}
          alt="Lumina Odontologia"
          className="w-[100px] object-contain"
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {navItems.map(({ icon: Icon, label }) => {
            const isActive = label === activeItem;
            return (
              <li key={label}>
                <button
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#EFE8DC] text-[#A38A4B] relative"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#A38A4B] rounded-r-full" />
                  )}
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
