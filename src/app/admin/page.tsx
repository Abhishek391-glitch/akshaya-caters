import { getDashboardStats } from '@/lib/db/adapter';
import Link from 'next/link';
import {
  UtensilsCrossed,
  Tags,
  Briefcase,
  Inbox,
  ArrowRight,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      label: 'Total Menu Items',
      value: stats.totalMenuItems,
      sub: `${stats.activeMenuItems} Active on Website`,
      icon: UtensilsCrossed,
      href: '/admin/menu',
      color: 'text-[#244C3A]',
    },
    {
      label: 'Active Categories',
      value: stats.totalCategories,
      sub: 'Menu Classifications',
      icon: Tags,
      href: '/admin/categories',
      color: 'text-[#244C3A]',
    },
    {
      label: 'Catering Services',
      value: stats.totalServices,
      sub: 'Packages Offered',
      icon: Briefcase,
      href: '/admin/services',
      color: 'text-[#244C3A]',
    },
    {
      label: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} New / Unhandled`,
      icon: Inbox,
      href: '/admin/enquiries',
      color: 'text-amber-700',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">NEW</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">CONTACTED</span>;
      case 'quotation_sent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">QUOTATION SENT</span>;
      case 'converted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">CONVERTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800">CLOSED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#244C3A]">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#747970] mt-1">
            Real-time status of your food menu, catering packages, customer leads, and inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/menu"
            className="px-4 py-2 bg-[#244C3A] hover:bg-[#193629] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <span>+ Add Menu Item</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 bg-white border border-[#E5E1D5] hover:bg-[#F1EFE5] text-[#244C3A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all inline-flex items-center gap-1.5"
          >
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="bg-white p-6 rounded-xl border border-[#E5E1D5] hover:border-[#8FA58A] shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-[#747970]">{card.label}</span>
                <div className="w-10 h-10 rounded-lg bg-[#FAF9F4] flex items-center justify-center text-[#244C3A] group-hover:bg-[#244C3A] group-hover:text-[#C6A66B] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="font-serif text-3xl font-bold text-[#244C3A]">
                {card.value}
              </div>
              <p className="text-[11px] text-[#747970] mt-1">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Enquiries & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5E1D5] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#F1EFE5]">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#244C3A]" />
              <h3 className="font-serif font-bold text-base text-[#244C3A]">
                Latest Customer Enquiries
              </h3>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#244C3A] hover:text-[#C6A66B] flex items-center gap-1"
            >
              <span>Manage All ({stats.totalEnquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentEnquiries.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#747970]">
              No enquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#F1EFE5] text-[#747970] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1EFE5]">
                  {stats.recentEnquiries.map((enq) => {
                    const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
                    return (
                      <tr key={enq.id} className="hover:bg-[#FAF9F4] transition-colors">
                        <td className="py-3 pr-3">
                          <p className="font-bold text-[#252923]">{enq.customer_name}</p>
                          <p className="text-[11px] text-[#747970]">{enq.phone}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <p className="font-medium text-[#252923]">{enq.event_type || enq.enquiry_type}</p>
                          {enq.guest_count && (
                            <p className="text-[11px] text-[#747970]">{enq.guest_count} guests</p>
                          )}
                        </td>
                        <td className="py-3 pr-3">
                          {getStatusBadge(enq.status)}
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${enq.customer_name}, thank you for contacting Akshaya Caterers regarding your catering inquiry.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center p-1.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${enq.phone}`}
                            className="inline-flex items-center p-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                            title="Call Customer"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E1D5] shadow-xs p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#244C3A]">
              Quick Management
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/menu"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E5E1D5] hover:border-[#244C3A] hover:bg-[#FAF9F4] transition-all text-xs font-semibold text-[#252923]"
              >
                <div className="flex items-center gap-2.5">
                  <UtensilsCrossed className="w-4 h-4 text-[#244C3A]" />
                  <span>Update Food Prices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#747970]" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E5E1D5] hover:border-[#244C3A] hover:bg-[#FAF9F4] transition-all text-xs font-semibold text-[#252923]"
              >
                <div className="flex items-center gap-2.5">
                  <Tags className="w-4 h-4 text-[#244C3A]" />
                  <span>Manage Menu Categories</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#747970]" />
              </Link>

              <Link
                href="/admin/services"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E5E1D5] hover:border-[#244C3A] hover:bg-[#FAF9F4] transition-all text-xs font-semibold text-[#252923]"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-[#244C3A]" />
                  <span>Edit Catering Packages</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#747970]" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-[#E5E1D5] hover:border-[#244C3A] hover:bg-[#FAF9F4] transition-all text-xs font-semibold text-[#252923]"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#244C3A]" />
                  <span>Update Contact & Phone</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#747970]" />
              </Link>
            </div>
          </div>

          <div className="bg-[#F1EFE5] rounded-xl border border-[#E5E1D5] p-5 space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#244C3A]">
              Database Status
            </h4>
            <p className="text-xs text-[#747970] leading-relaxed">
              Database synchronization is active. All menu edits, newly added dishes, price updates, and customer leads are instantly committed and reflected on the live public website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
