// Simple utilities
    document.getElementById('y').textContent = new Date().getFullYear()

    // Copy email
    const copyBtn = document.getElementById('copy')
    if (copyBtn){
      copyBtn.addEventListener('click', () => {
        const em = document.getElementById('em').textContent
        navigator.clipboard.writeText(em).then(() => {
          copyBtn.textContent = 'Copied!'
          setTimeout(()=>copyBtn.textContent='Copy', 1500)
        })
      })
    }

    // Smooth-scroll for sidebar anchors
    document.querySelectorAll('a.sidebtn').forEach(a=>{
      a.addEventListener('click', e => {
        const href = a.getAttribute('href')
        if(href && href.startsWith('#')){
          e.preventDefault()
          document.querySelector(href)?.scrollIntoView({behavior:'smooth'})
          document.querySelectorAll('.sidebtn').forEach(s=>s.classList.remove('active'))
          a.classList.add('active')
        }
      })
    })

