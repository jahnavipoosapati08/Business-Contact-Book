import React, { useMemo, useState } from 'react';
import {
  LayoutDashboard, ContactRound, Users, Star, Settings, HelpCircle,
  Search, Bell, Plus, Download, MoreHorizontal, Mail, Phone, MapPin,
  Pencil, Trash2, X, BriefcaseBusiness, Menu
} from 'lucide-react';

const starterContacts = [
  { id: 1, name: 'Aarav Sharma', role: 'Business Development', company: 'Nova Technologies', email: 'aarav@novatech.com', phone: '+91 98765 43210', address: 'Hyderabad, Telangana', tag: 'Client', color: 'violet' },
  { id: 2, name: 'Priya Reddy', role: 'Marketing Manager', company: 'Bright Media', email: 'priya@brightmedia.in', phone: '+91 91234 56780', address: 'Vijayawada, Andhra Pradesh', tag: 'Partner', color: 'pink' },
  { id: 3, name: 'Rahul Verma', role: 'Project Lead', company: 'Vertex Solutions', email: 'rahul@vertex.io', phone: '+91 99887 76655', address: 'Bengaluru, Karnataka', tag: 'Client', color: 'blue' },
  { id: 4, name: 'Sneha Kapoor', role: 'HR Executive', company: 'PeopleFirst', email: 'sneha@peoplefirst.com', phone: '+91 90909 80808', address: 'Chennai, Tamil Nadu', tag: 'Personal', color: 'orange' },
  { id: 5, name: 'Kiran Kumar', role: 'Founder', company: 'K2 Enterprises', email: 'kiran@k2enterprises.in', phone: '+91 93456 78901', address: 'Kadapa, Andhra Pradesh', tag: 'VIP', color: 'green' },
  { id: 6, name: 'Ananya Das', role: 'Account Manager', company: 'CloudNine', email: 'ananya@cloudnine.in', phone: '+91 87654 32109', address: 'Pune, Maharashtra', tag: 'Partner', color: 'cyan' }
];

const emptyForm = { name: '', role: '', company: '', email: '', phone: '', address: '', tag: 'Client' };

export default function App() {
  const [contacts, setContacts] = useState(starterContacts);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Contacts');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [active, setActive] = useState('Contacts');

  const filtered = useMemo(() => contacts.filter(c => {
    const q = search.toLowerCase();
    const matches = [c.name, c.email, c.phone, c.company, c.address].some(v => v.toLowerCase().includes(q));
    return matches && (filter === 'All Contacts' || c.tag === filter);
  }), [contacts, search, filter]);

  function openAdd() { setEditing(null); setForm(emptyForm); setModal(true); }
  function openEdit(c) { setEditing(c.id); setForm({ name:c.name, role:c.role, company:c.company, email:c.email, phone:c.phone, address:c.address, tag:c.tag }); setModal(true); }
  function saveContact(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) return;
    if (editing) setContacts(prev => prev.map(c => c.id === editing ? { ...c, ...form } : c));
    else setContacts(prev => [{ ...form, id: Date.now(), color: 'violet' }, ...prev]);
    setModal(false);
  }
  function deleteContact(id) {
    if (window.confirm('Delete this contact?')) setContacts(prev => prev.filter(c => c.id !== id));
  }
  function exportCSV() {
    const headers = ['Name','Role','Company','Email','Phone','Address','Category'];
    const rows = contacts.map(c => [c.name,c.role,c.company,c.email,c.phone,c.address,c.tag]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'business-contacts.csv'; a.click(); URL.revokeObjectURL(url);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon"><BriefcaseBusiness size={20}/></div><div><b>CONTACTLY</b><small>BUSINESS BOOK</small></div></div>
      <div className="nav-label">MENU</div>
      {[
        [LayoutDashboard,'Dashboard'], [ContactRound,'Contacts'], [Users,'Companies'], [Star,'Favorites']
      ].map(([Icon,label]) => <button key={label} className={`nav-item ${active===label?'active':''}`} onClick={()=>setActive(label)}><Icon size={17}/>{label}</button>)}
      <div className="nav-label second">PREFERENCES</div>
      <button className="nav-item" onClick={()=>setActive('Settings')}><Settings size={17}/>Settings</button>
      <button className="nav-item" onClick={()=>setActive('Help Center')}><HelpCircle size={17}/>Help Center</button>
      <div className="sidebar-bottom"><div className="mini-avatar">PK</div><div><b>My Workspace</b><small>Personal account</small></div><MoreHorizontal size={18}/></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div className="mobile-brand"><Menu size={20}/> CONTACTLY</div>
        <div className="crumb">Workspace <span>/</span> <b>{active}</b></div>
        <div className="top-actions"><button className="icon-btn"><Bell size={18}/><i/></button><div className="profile"><div className="profile-avatar">PK</div><div><b>Profile</b><small>Administrator</small></div></div></div>
      </header>

      <section className="welcome-row">
        <div><div className="eyebrow">YOUR NETWORK, ORGANIZED</div><h1>Business <em>Contacts</em></h1><p>Manage your professional relationships in one simple place.</p></div>
        <button className="primary-btn" onClick={openAdd}><Plus size={17}/> Add New Contact</button>
      </section>

      <section className="stats">
        <Stat icon={<ContactRound/>} label="TOTAL CONTACTS" value={contacts.length} note="+12% this month" />
        <Stat icon={<BriefcaseBusiness/>} label="COMPANIES" value={new Set(contacts.map(c=>c.company).filter(Boolean)).size} note="Across your network" />
        <Stat icon={<Star/>} label="VIP CONTACTS" value={contacts.filter(c=>c.tag==='VIP').length} note="Important connections" />
        <Stat icon={<Users/>} label="CATEGORIES" value={new Set(contacts.map(c=>c.tag)).size} note="Organized contacts" />
      </section>

      <section className="content-card">
        <div className="section-head"><div><h2>All Contacts</h2><p>Your saved business and personal connections</p></div><div className="head-actions"><button className="outline-btn" onClick={exportCSV}><Download size={15}/> Export CSV</button><button className="primary-btn small" onClick={openAdd}><Plus size={16}/> Add Contact</button></div></div>
        <div className="toolbar">
          <div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, company, email or phone..." /></div>
          <select value={filter} onChange={e=>setFilter(e.target.value)}><option>All Contacts</option><option>Client</option><option>Partner</option><option>Personal</option><option>VIP</option></select>
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>CONTACT NAME</th><th>COMPANY / ROLE</th><th>EMAIL ADDRESS</th><th>PHONE NUMBER</th><th>LOCATION</th><th>CATEGORY</th><th></th></tr></thead>
          <tbody>{filtered.map(c=><tr key={c.id}>
            <td><div className="person"><div className={`avatar ${c.color||'violet'}`}>{c.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div><div><b>{c.name}</b><small>{c.role || 'Business contact'}</small></div></div></td>
            <td><b className="company">{c.company || '—'}</b><small className="sub-cell">{c.role || '—'}</small></td>
            <td><a className="contact-link" href={`mailto:${c.email}`}><Mail size={14}/>{c.email}</a></td>
            <td><a className="contact-link" href={`tel:${c.phone}`}><Phone size={14}/>{c.phone}</a></td>
            <td><span className="location"><MapPin size={14}/>{c.address || '—'}</span></td>
            <td><span className={`tag ${c.tag.toLowerCase()}`}>{c.tag}</span></td>
            <td><div className="row-actions"><button title="Edit" onClick={()=>openEdit(c)}><Pencil size={15}/></button><button title="Delete" onClick={()=>deleteContact(c.id)}><Trash2 size={15}/></button></div></td>
          </tr>)}</tbody></table>
          {filtered.length===0 && <div className="empty">No contacts found. Try another search or add a new contact.</div>}
        </div>
        <div className="table-footer">Showing <b>{filtered.length}</b> of <b>{contacts.length}</b> contacts <span>All changes are saved in this browser session</span></div>
      </section>
      <footer>© 2026 Contactly · Business Contact Book <span>Made to keep your network connected.</span></footer>
    </main>

    {modal && <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setModal(false)}}><form className="modal" onSubmit={saveContact}>
      <div className="modal-head"><div><div className="eyebrow">CONTACT DETAILS</div><h2>{editing?'Edit Contact':'Add New Contact'}</h2></div><button type="button" className="close-btn" onClick={()=>setModal(false)}><X size={19}/></button></div>
      <div className="form-grid">
        <Field label="Full Name *" value={form.name} onChange={v=>setForm({...form,name:v})} placeholder="Enter full name" />
        <Field label="Job Title" value={form.role} onChange={v=>setForm({...form,role:v})} placeholder="e.g. Sales Manager" />
        <Field label="Company" value={form.company} onChange={v=>setForm({...form,company:v})} placeholder="Company name" />
        <Field label="Email Address *" type="email" value={form.email} onChange={v=>setForm({...form,email:v})} placeholder="name@company.com" />
        <Field label="Phone Number *" value={form.phone} onChange={v=>setForm({...form,phone:v})} placeholder="+91 98765 43210" />
        <div className="field"><label>Category</label><select value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})}><option>Client</option><option>Partner</option><option>Personal</option><option>VIP</option></select></div>
        <div className="field full"><label>Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="City, State, Country"/></div>
      </div>
      <div className="modal-actions"><button type="button" className="outline-btn" onClick={()=>setModal(false)}>Cancel</button><button className="primary-btn" type="submit">{editing?'Save Changes':'Save Contact'}</button></div>
    </form></div>}
  </div>;
}

function Stat({icon,label,value,note}) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><i>{React.cloneElement(icon,{size:17})}</i></div><strong>{value}</strong><small>{note}</small></div>; }
function Field({label,value,onChange,placeholder,type='text'}) { return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>; }