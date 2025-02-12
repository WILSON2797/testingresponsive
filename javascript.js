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
