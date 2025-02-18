$(document).ready(function () {
    // Fungsi untuk menambahkan class 'active' ke menu yang sesuai dengan URL
    function setActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop(); // Ambil nama file dari URL
        $('.sidebar ul li a').each(function () {
            const menuHref = $(this).attr('href'); // Ambil nama file dari href

            // Cek jika href ada dan cocok dengan currentPage
            if (menuHref && menuHref.includes(currentPage)) {
                $(this).parent().removeClass('active');
                $(this).parent().addClass('active');
            } else {
                $(this).parent().removeClass('active');
            }
        });
    }

    // Panggil fungsi setActiveMenu saat halaman dimuat
    setActiveMenu();

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
    $(document).on('click', function (e) {
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
    $('.sidebar').on('click', function (e) {
        e.stopPropagation();
    });

    // ============================
    // 🚀 Fungsi untuk Mengisi Dropdown dari Database
    // ============================
    function loadDropdownData(selectElement, dataType) {
        $.ajax({
            url: 'dropdownlist.php',
            type: 'GET',
            data: { type: dataType },
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    $(selectElement).find('option:not(:first)').remove();
                    // Tambahkan opsi baru dari database
                    $.each(response.data, function (index, item) {
                        $(selectElement).append(new Option(item.text, item.value));
                    });

                    // Refresh select
                    $(selectElement).trigger('change');
                } else {
                    console.error('Gagal Memuat Data:', response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    // 📌 Memuat Data ke Dropdown
    loadDropdownData('select[name="region"]', 'region');
    loadDropdownData('select[name="nama_driver"]', 'nama_driver');
    loadDropdownData('select[name="nopol"]', 'nopol');
    loadDropdownData('select[name="merk"]', 'merk');
    loadDropdownData('select[name="type"]', 'type');

    // ============================
    // ✅ Tambahan: Auto Mengisi Data dari "Nopol"
    // ============================
    $('select[name="nopol"]').change(function () {
        var selectedNopol = $(this).val(); // Ambil Nopol yang dipilih

        if (selectedNopol) {
            $.ajax({
                url: 'dropdownlist.php',
                type: 'GET',
                data: { type: 'unit_details', nopol: selectedNopol },
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        // Mengisi input berdasarkan data dari database
                        $('select[name="merk"]').val(response.data.merk).trigger('change');
                        $('select[name="type"]').val(response.data.type).trigger('change');
                        $('select[name="model"]').val(response.data.model).trigger('change');
                        $('select[name="tahun"]').val(response.data.tahun_pembuatan).trigger('change');
                    } else {
                        console.error('Data Unit Tidak Ditemukan:', response.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Error:', error);
                }
            });
        } else {
            // Reset jika Nopol dikosongkan
            $('select[name="merk"], select[name="type"], select[name="model"], select[name="tahun"]').val("").trigger('change');
        }
    });

    // ============================
    // 🚀 Inisialisasi Select2
    // ============================
    $('.select2').select2({
        width: '100%',
        dropdownParent: $('#inspeksiModal'),
        allowClear: true,
        placeholder: {
            id: '',
            text: 'Pilih...'
        },
        language: {
            noResults: function () {
                return "Data tidak ditemukan";
            },
            searching: function () {
                return "Mencari...";
            }
        },
        dropdownAutoWidth: true,
        dropdownCssClass: "select2-dropdown-position-fix"
    });

    // Tambahkan di dalam $(document).ready(function() { ... })
    $('#exportExcel').on('click', function() {
        window.location.href = 'export_excel.php';
        });

    // ============================
    // 📝 Tambahan Reset Select2 saat modal ditutup
    // ============================
    $('#inspeksiModal').on('hidden.bs.modal', function () {
        $('.select2').val('').trigger('change');
    });

    // ============================
    // 🔄 Inisialisasi DataTables
    // ============================
    $('#tabelInspeksi').DataTable({
        "ajax": {
            "url": "ambil_data.php",
            "dataSrc": ""
        },
        "columns": [
            {
                "data": null,
                "render": function (data, type, row, meta) {
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
                "render": function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm">Edit</button>
                        <button class="btn btn-danger btn-sm">Hapus</button>
                    `;
                }
            }
        ],
        "order": [[0, 'asc']],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json"
        }
    });

    // ============================
    // 🔔 Modal Notifikasi & Error Handling
    // ============================
    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));

    // ============================
    // 🚀 Submit Form dengan AJAX
    // ============================
    $('form').on('submit', function (e) {
        e.preventDefault();

        $('#loading').show();

        $.ajax({
            url: 'proses_input.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                $('#loading').hide();
                $('#inspeksiModal').modal('hide');
                $('form')[0].reset();
                $('.select2').val('').trigger('change');
                $('#tabelInspeksi').DataTable().ajax.reload();
                notificationModal.show();
            },
            error: function (xhr, status, error) {
                $('#loading').hide();
                $('#errorMessage').text('Terjadi kesalahan: ' + error);
                errorModal.show();
            }
        });
    });

    // Hapus backdrop saat modal ditutup
    $('#notificationModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });

    $('#errorModal').on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
    });
});
