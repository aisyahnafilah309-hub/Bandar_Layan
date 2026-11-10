// Storage Service with Mock Backend State Machine
// Adheres to PRD BANDAR LAYAN Section 7, 10, & 11

import {
  INITIAL_SERVICES,
  INITIAL_USERS,
  INITIAL_REQUESTS,
  INITIAL_COMPLAINTS,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';

export { INITIAL_USERS };

const STORAGE_KEYS = {
  SERVICES: 'bandar_layan_services',
  USERS: 'bandar_layan_users',
  REQUESTS: 'bandar_layan_requests',
  COMPLAINTS: 'bandar_layan_complaints',
  AUDIT_LOGS: 'bandar_layan_audit_logs',
  CURRENT_USER: 'bandar_layan_session_user'
};

const delay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Storage read error for ${key}:`, err);
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Storage write error for ${key}:`, err);
  }
}

// Masking helpers for privacy (Design Skill & PRD NFR-03/Privacy)
export function maskNik(nik) {
  if (!nik || typeof nik !== 'string') return '-';
  if (nik.length < 16) return nik.replace(/.(?=.{4})/g, '*');
  return `${nik.slice(0, 6)}******${nik.slice(-4)}`;
}

export function maskPhone(phone) {
  if (!phone || typeof phone !== 'string') return '-';
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-4)}`;
}

// Authentication API
export const authService = {
  async getCurrentUser() {
    await delay(100);
    const user = getStored(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
    return user;
  },

  async login(email, password) {
    await delay(250);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      throw new Error('Email atau kata sandi tidak ditemukan pada sistem.');
    }

    // Prototype password matching simulation
    // Accept valid demo credentials: warga123, petugas123, admin123, or any matching prefix
    const isValidDemoPass = password && password.length >= 6;
    if (!isValidDemoPass) {
      throw new Error('Kata sandi minimal 6 karakter.');
    }

    setStored(STORAGE_KEYS.CURRENT_USER, found);
    return found;
  },

  async switchRole(role) {
    await delay(150);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const targetUser = users.find(u => u.role === role) || users[0];
    setStored(STORAGE_KEYS.CURRENT_USER, targetUser);
    return targetUser;
  },

  async logout() {
    await delay(100);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return true;
  },

  async updateProfile(userId, updatedFields) {
    await delay(200);
    const users = getStored(STORAGE_KEYS.USERS, INITIAL_USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('Pengguna tidak ditemukan');
    users[idx] = { ...users[idx], ...updatedFields };
    setStored(STORAGE_KEYS.USERS, users);
    setStored(STORAGE_KEYS.CURRENT_USER, users[idx]);
    return users[idx];
  }
};

// Services Catalog API
export const servicesService = {
  async getAll() {
    await delay(150);
    return getStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async getById(id) {
    await delay(100);
    const list = getStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const srv = list.find(s => s.id === id);
    if (!srv) throw new Error('Layanan tidak ditemukan');
    return srv;
  },

  async create(newService) {
    await delay(250);
    const list = getStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const created = {
      ...newService,
      id: `srv-${Date.now().toString(36)}`,
      totalSubmitted: 0,
      rating: 5.0,
      isActive: true
    };
    list.unshift(created);
    setStored(STORAGE_KEYS.SERVICES, list);

    auditService.recordLog('ADMIN', 'CREATE_SERVICE', created.id, `Menambahkan layanan baru: ${created.name}`);
    return created;
  },

  async update(id, fields) {
    await delay(200);
    const list = getStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Layanan tidak ditemukan');
    list[idx] = { ...list[idx], ...fields };
    setStored(STORAGE_KEYS.SERVICES, list);

    auditService.recordLog('ADMIN', 'UPDATE_SERVICE', id, `Memperbarui konfigurasi layanan: ${list[idx].name}`);
    return list[idx];
  },

  async toggleActive(id) {
    await delay(150);
    const list = getStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const srv = list.find(s => s.id === id);
    if (!srv) throw new Error('Layanan tidak ditemukan');
    srv.isActive = !srv.isActive;
    setStored(STORAGE_KEYS.SERVICES, list);

    auditService.recordLog('ADMIN', 'TOGGLE_SERVICE', id, `Mengubah status aktif layanan ${srv.name} menjadi ${srv.isActive ? 'Aktif' : 'Nonaktif'}`);
    return srv;
  }
};

// Service Requests API (Permohonan Layanan)
export const requestsService = {
  async getAll(user) {
    await delay(180);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    if (!user) return [];

    // RBAC Scope check (PRD Section 3.1 & 6)
    if (user.role === 'masyarakat') {
      return all.filter(r => r.userId === user.id);
    }
    // Petugas & Administrator can see the whole queue or assigned OPD
    return all;
  },

  async getById(id, user) {
    await delay(120);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === id || r.requestNumber === id);
    if (!req) throw new Error('Permohonan tidak ditemukan');

    // Access control: citizen can only view their own
    if (user && user.role === 'masyarakat' && req.userId !== user.id) {
      throw new Error('Akses ditolak: Anda tidak memiliki wewenang melihat permohonan ini.');
    }
    return req;
  },

  async submitNewRequest(requestData, currentUser) {
    await delay(300);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const requestNumber = `REG-2026-BDL-${randomSuffix}`;

    const newRequest = {
      id: `req-${Date.now()}`,
      requestNumber,
      userId: currentUser.id,
      applicantName: currentUser.name,
      applicantNik: currentUser.nik || '1871026405020001',
      serviceId: requestData.serviceId,
      serviceName: requestData.serviceName,
      category: requestData.category || 'Kependudukan',
      opd: requestData.opd || 'Dinas Kependudukan & Catatan Sipil',
      status: 'submitted', // initial status
      priority: 'Normal',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      formData: requestData.formData || {},
      documents: requestData.documents || [],
      checklist: (requestData.requirements || []).map(r => ({
        item: `Kesesuaian berkas: ${r}`,
        valid: null
      })),
      timeline: [
        {
          title: 'Permohonan Berhasil Dikirim',
          time: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
          actor: `Masyarakat (${currentUser.name})`,
          note: `Formulir permohonan dan ${requestData.documents?.length || 0} berkas persyaratan berhasil diunggah.`
        }
      ],
      publicNote: 'Permohonan telah berhasil dikirim dan masuk dalam antrean awal verifikasi dinas terkait.',
      internalNote: 'Menunggu penugasan verifikator front-office.',
      edocAvailable: false,
      ratingGiven: null
    };

    all.unshift(newRequest);
    setStored(STORAGE_KEYS.REQUESTS, all);

    auditService.recordLog(
      currentUser.name,
      'SUBMIT_REQUEST',
      requestNumber,
      `Mengajukan permohonan baru untuk layanan ${requestData.serviceName}`
    );

    return newRequest;
  },

  async updateStatus(requestId, { newStatus, publicNote, internalNote, actorName }) {
    await delay(250);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === requestId);
    if (!req) throw new Error('Permohonan tidak ditemukan');

    // State machine transitions validator (PRD 7.2)
    const validTransitions = {
      submitted: ['under_review', 'cancelled'],
      under_review: ['in_process', 'needs_revision', 'rejected', 'cancelled'],
      needs_revision: ['under_review'],
      in_process: ['completed', 'needs_revision', 'rejected'],
      rejected: [],
      completed: [],
      cancelled: []
    };

    const allowed = validTransitions[req.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Transisi status tidak diizinkan: dari '${req.status}' ke '${newStatus}'.`);
    }

    const previousStatus = req.status;
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    if (publicNote) req.publicNote = publicNote;
    if (internalNote) req.internalNote = internalNote;

    // Auto mark e-document available if completed
    if (newStatus === 'completed') {
      req.edocAvailable = true;
    }

    const statusLabels = {
      under_review: 'Mulai Diverifikasi',
      in_process: 'Sedang Diproses OPD',
      needs_revision: 'Permintaan Perbaikan Berkas',
      rejected: 'Permohonan Ditolak',
      completed: 'Selesai Diterbitkan',
      cancelled: 'Permohonan Dibatalkan'
    };

    const timelineTitle = statusLabels[newStatus] || `Status Diubah ke ${newStatus}`;
    req.timeline.push({
      title: timelineTitle,
      time: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      actor: actorName || 'Petugas Pelayanan',
      note: publicNote || `Status permohonan diperbarui dari ${previousStatus} menjadi ${newStatus}.`
    });

    setStored(STORAGE_KEYS.REQUESTS, all);

    auditService.recordLog(
      actorName || 'Petugas',
      'UPDATE_STATUS',
      req.requestNumber,
      `Mengubah status dari ${previousStatus} -> ${newStatus}. Catatan: ${publicNote || '-'}`
    );

    return req;
  },

  async updateChecklist(requestId, checklistIndex, isValid, actorName) {
    await delay(150);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === requestId);
    if (!req) throw new Error('Permohonan tidak ditemukan');

    if (req.checklist && req.checklist[checklistIndex] !== undefined) {
      req.checklist[checklistIndex].valid = isValid;
    }
    req.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.REQUESTS, all);

    auditService.recordLog(
      actorName || 'Petugas',
      'CHECKLIST_ITEM',
      req.requestNumber,
      `Memvalidasi item checklist #${checklistIndex + 1} menjadi ${isValid ? 'Valid' : 'Tidak Sesuai'}`
    );

    return req;
  },

  async reuploadRevisionDocument(requestId, updatedDocuments, note, userName) {
    await delay(250);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === requestId);
    if (!req) throw new Error('Permohonan tidak ditemukan');

    if (req.status !== 'needs_revision') {
      throw new Error('Permohonan tidak dalam status perbaikan berkas.');
    }

    req.documents = updatedDocuments;
    req.status = 'under_review';
    req.updatedAt = new Date().toISOString();
    req.publicNote = 'Dokumen perbaikan telah dikirim ulang oleh pemohon dan menunggu verifikasi ulang petugas.';

    req.timeline.push({
      title: 'Berkas Perbaikan Dikirim Ulang',
      time: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      actor: `Masyarakat (${userName})`,
      note: note || 'Pemohon telah mengunggah ulang dokumen revisi yang diminta.'
    });

    setStored(STORAGE_KEYS.REQUESTS, all);

    auditService.recordLog(
      userName,
      'REUPLOAD_REVISION',
      req.requestNumber,
      'Mengunggah ulang berkas revisi dan mengembalikan status ke under_review'
    );

    return req;
  },

  async submitRating(requestId, score, comment, userName) {
    await delay(200);
    const all = getStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const req = all.find(r => r.id === requestId);
    if (!req) throw new Error('Permohonan tidak ditemukan');

    if (req.status !== 'completed') {
      throw new Error('Rating hanya dapat diberikan pada permohonan yang telah berstatus Selesai.');
    }

    req.ratingGiven = score;
    req.ratingFeedback = comment;
    setStored(STORAGE_KEYS.REQUESTS, all);

    auditService.recordLog(
      userName,
      'SUBMIT_RATING',
      req.requestNumber,
      `Memberikan penilaian kepuasan ${score}/5 bintang.`
    );

    return req;
  }
};

// Complaints API (Pengaduan & Aspirasi Masyarakat)
export const complaintsService = {
  async getAll(user) {
    await delay(150);
    const all = getStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    if (!user) return [];
    if (user.role === 'masyarakat') {
      return all.filter(c => c.userId === user.id);
    }
    return all;
  },

  async submitComplaint(data, user) {
    await delay(280);
    const all = getStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    const ticketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      id: `cmp-${Date.now()}`,
      ticketNumber,
      userId: user.id,
      reporterName: data.isAnonymous ? 'Warga Bandar Lampung (Anonim)' : user.name,
      isAnonymous: !!data.isAnonymous,
      category: data.category,
      subject: data.subject,
      location: data.location,
      incidentDate: data.incidentDate || 'Hari ini',
      description: data.description,
      evidenceImage: data.evidenceName || 'bukti_laporan.jpg',
      status: 'submitted',
      opdTarget: data.opdTarget || 'Instansi Terkait Kota Bandar Lampung',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      followUps: [
        {
          time: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
          actor: 'Sistem Pengaduan Warga',
          note: 'Laporan pengaduan berhasil dicatat dengan nomor tiket resmi.'
        }
      ]
    };

    all.unshift(newComplaint);
    setStored(STORAGE_KEYS.COMPLAINTS, all);

    auditService.recordLog(
      data.isAnonymous ? 'Anonim' : user.name,
      'SUBMIT_COMPLAINT',
      ticketNumber,
      `Membuat pengaduan kategori: ${data.category}`
    );

    return newComplaint;
  },

  async updateComplaintStatus(complaintId, status, note, actorName) {
    await delay(200);
    const all = getStored(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    const cmp = all.find(c => c.id === complaintId);
    if (!cmp) throw new Error('Pengaduan tidak ditemukan');

    cmp.status = status;
    cmp.updatedAt = new Date().toISOString();
    cmp.followUps.push({
      time: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      actor: actorName || 'Petugas Pengawas',
      note: note || `Status penanganan diubah menjadi: ${status}`
    });

    setStored(STORAGE_KEYS.COMPLAINTS, all);
    auditService.recordLog(actorName, 'UPDATE_COMPLAINT', cmp.ticketNumber, `Tindak lanjut: ${status}`);
    return cmp;
  }
};

// Audit Log API
export const auditService = {
  async getAll() {
    await delay(120);
    return getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  recordLog(actor, action, target, details) {
    const all = getStored(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    const newLog = {
      id: `log-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      target,
      details
    };
    all.unshift(newLog);
    // keep max 100 logs
    if (all.length > 100) all.pop();
    setStored(STORAGE_KEYS.AUDIT_LOGS, all);
  }
};
