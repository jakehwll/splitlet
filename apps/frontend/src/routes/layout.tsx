import { ClientProvider } from "../components/ClientProvider";
import { ChevronDown, Inbox, type LucideIcon, Plus, Receipt, Sparkles, UserPlus } from "lucide-react";

import ICON__FIREWORK from "../assets/icon__firework.jpg";
import ICON__TORIGATE from "../assets/icon__torigate.jpg";
import { Link, Outlet } from "react-router";

const Navigation = ({
  title,
  items,
}: {
  title?: string;
  items: Array<{
    icon:
      | {
          type: "lucide";
          value: LucideIcon;
        }
      | {
          type: "group";
          value: string;
        }
      | {
          type: "user";
          value: string;
        };
    name: string;
    href: string;
  }>;
}) => {
  return (
    <div className="flex flex-col">
      {title && (
        <div className="flex items-center gap-1 px-4">
          <h2 className="text-xs font-medium text-gray-400">{title}</h2>
          <button type="button">
            <ChevronDown size={12} />
          </button>
        </div>
      )}
      <ul className="flex flex-col mt-2 mb-5">
        {items.map(({ icon, name, href }) => (
          <li className="flex py-0.5 cursor-default" key={name}>
            <Link
              to={href}
              className="font-medium px-3 py-2 flex items-center gap-3 rounded-md hover:bg-gray-900 pl-4.5 w-full cursor-default"
            >
              {icon.type === "lucide" && <icon.value size={18} className="text-gray-500" />}
              {icon.type === "group" && (
                <div className="relative w-5 h-5 border border-white/10 bg-gray-600 rounded-md overflow-hidden">
                  <img src={icon.value} alt={name} />
                </div>
              )}
              {icon.type === "user" && (
                <div className="relative w-5 h-5 rounded-full overflow-hidden">
                  <img src={icon.value} alt={name} />
                </div>
              )}
              <span className="text-sm text-gray-300">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Layout = () => {
  return (
    <ClientProvider>
      <section className="flex">
        <aside className="px-4 w-72 h-screen min-w-0 pt-6 pb-2 flex flex-col gap-1">
          <header className="flex items-center justify-between pl-3 py-2 pr-2">
            <Link to={"/"} className="flex items-center gap-3 cursor-default">
              <div className="w-8 h-8 bg-linear-to-b from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Sparkles size={20} className={"text-green-200"} fill={"currentColor"} />
              </div>
              <span className="font-serif text-2xl font-medium text-white">Splitlet</span>
            </Link>
          </header>
          <Navigation
            items={[
              { icon: { type: "lucide", value: Inbox }, name: "Dashboard", href: "/" },
              { icon: { type: "lucide", value: Receipt }, name: "Recent Activity", href: "/recent-activity" },
            ]}
          />
          <Navigation
            title="Groups"
            items={[
              { icon: { type: "group", value: ICON__TORIGATE }, name: "Japan Trip 2023", href: "/groups/abc" },
              { icon: { type: "group", value: ICON__FIREWORK }, name: "Sydney New Years", href: "/groups/def" },
              { icon: { type: "group", value: ICON__FIREWORK }, name: "Melbourne New Years", href: "/groups/ghi" },
              { icon: { type: "lucide", value: Plus }, name: "New Group", href: "/groups/create" },
            ]}
          />
          <Navigation
            title="Friends"
            items={[
              { icon: { type: "user", value: ICON__TORIGATE }, name: "John Doe", href: "/friends/abcd" },
              { icon: { type: "user", value: ICON__TORIGATE }, name: "Jane Appleseed", href: "/friends/defg" },
              { icon: { type: "user", value: ICON__TORIGATE }, name: "Bob Brown", href: "/friends/hijk" },
              { icon: { type: "user", value: ICON__TORIGATE }, name: "Clover Clark", href: "/friends/lmno" },
              { icon: { type: "lucide", value: UserPlus }, name: "Add Friend", href: "/friends/create" },
            ]}
          />
        </aside>
        <main className="flex-1 p-2 min-h-screen flex flex-col p-2 min-w-0">
          <div className="flex-1 p-8 border border-gray-800 bg-gray-900 rounded-lg shadow-sm flex flex-col gap-8">
            <Outlet />
          </div>
        </main>
      </section>
    </ClientProvider>
  );
};

export default Layout;
