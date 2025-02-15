$(".sidebar ul li").on('click', function () {
    $(".sidebar ul li.active").removeClass('active');
    $(this).addClass('active');
});

$('.open-btn').on('click', function () {
    $('.sidebar').addClass('active');
});

$('.close-btn').on('click', function () {
    $('.sidebar').removeClass('active');
});

// Menambahkan event handler untuk klik di luar sidebar
$(document).on('click', function(e) {
    // Cek jika layar kecil (mobile)
    if (window.innerWidth <= 767) {
        // Cek apakah yang diklik bukan sidebar, bukan tombol open-btn, dan sidebar sedang aktif
        if (!$(e.target).closest('.sidebar').length && 
            !$(e.target).closest('.open-btn').length && 
            $('.sidebar').hasClass('active')) {
            
            $('.sidebar').removeClass('active');
        }
    }
});

// Mencegah sidebar tertutup ketika mengklik di dalam sidebar
$('.sidebar').on('click', function(e) {
    e.stopPropagation();
});

$(document).ready(function() {
    // Inisialisasi Select2 pada semua dropdown
    $('.select2').select2({
        width: '100%',
        dropdownParent: $('#inspeksiModal'),
        allowClear: true,
        placeholder: {
            id: '',
            text: 'Pilih...'
        },
        language: {
            noResults: function() {
                return "Data tidak ditemukan";
            },
            searching: function() {
                return "Mencari...";
            }
        }
    });

    // Tambahkan di dalam $(document).ready(function() { ... })
    $('#exportExcel').on('click', function() {
    window.location.href = 'export_excel.php';
    });

    // Reset Select2 saat modal ditutup
    $('#inspeksiModal').on('hidden.bs.modal', function () {
        $('.select2').val('').trigger('change');
    });

    // Inisialisasi DataTables
    $('#tabelInspeksi').DataTable({
        "ajax": {
            "url": "ambil_data.php",
            "dataSrc": ""
        },
        "columns": [
        {
            "data":null,
            "render":function (data,type,row,meta) {
                return meta.row + meta.settings._iDisplayStart + 1;
            }
        },
            { "data": "region" },
            { "data": "nama_driver" },
            { "data": "nopol" },
            { "data": "merk" },
            { "data": "type" },
            { "data": "rekomendasi" },
            {
                "data": null,
                "render": function(data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Hapus</button>
                    `;
                }
            }
        ],
        // menambah nomor urut otomatis
        "order":[[0, 'asc']],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json"
        }
    });

    // Inisialisasi modal notifications
    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

    // Submit form dengan AJAX
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        // Tampilkan loading
        $('#loading').show();

        $.ajax({
            url: 'proses_input.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function(response) {
                // Sembunyikan loading
                $('#loading').hide();
                
                // Tutup modal form
                $('#inspeksiModal').modal('hide');
                
                // Reset form
                $('form')[0].reset();
                $('.select2').val('').trigger('change');
                
                // Reload DataTables
                $('#tabelInspeksi').DataTable().ajax.reload();
                
                // Tampilkan modal sukses
                notificationModal.show();
                
                // Tutup modal sukses setelah 2 detik
                // setTimeout(function() {
                //     notificationModal.hide();
                //     // Hapus backdrop secara manual
                //     $('.modal-backdrop').remove();
                // }, 2000);
            },
            error: function(xhr, status, error) {
                // Sembunyikan loading
                $('#loading').hide();
                
                // Set pesan error
                $('#errorMessage').text('Terjadi kesalahan: ' + error);
                
                // Tampilkan modal error
                errorModal.show();
                
                // Tutup modal error setelah 3 detik
                // setTimeout(function() {
                //     errorModal.hide();
                //     // Hapus backdrop secara manual
                //     $('.modal-backdrop').remove();
                // }, 3000);
            }
        });
    });

    // Pastikan backdrop dihapus saat modal notification atau error ditutup
    $('#notificationModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

    $('#errorModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });
});
