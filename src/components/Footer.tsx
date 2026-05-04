import { Facebook, Instagram, Youtube, Linkedin, Lock, Award, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { siteConfig } from "@/config/site.config";
import { memo } from "react";

const Footer = () => (
  <footer className="bg-[#5A7A5C] text-white py-6 md:py-8 lg:pt-10 xl:pt-12 pb-20 sm:pb-12">


    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
        {/* Brand Column */}
        <div className="max-w-xs">
          <h2 className="font-display font-bold text-3xl mb-4 text-white">Salmara Ayurveda</h2>
          <p className="text-white/90 font-body text-base leading-relaxed">
            Rediscover Wellness Through Authentic Ayurveda. Rooted in Karnataka, trusted PAN India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4 md:mb-8 text-white">Quick Links</h3>
          <ul className="space-y-4">
            {["Home", "About Us", "Shop Now", "Clinics", "Contact Us"].map((label) => {
              const href = label === "Home" ? "/" : 
                           label === "About Us" ? "/about" : 
                           label === "Shop Now" ? "/shop" : 
                           label === "Clinics" ? "/clinics" : 
                           label === "Contact Us" ? "/contact" : "#footer";
              
              const isExternal = href.startsWith("#");
              
              return (
                <li key={label}>
                  {isExternal ? (
                    <a href={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4 md:mb-8 text-white">Legal</h3>
          <ul className="space-y-4">
            {["Terms & Conditions", "Privacy Policy", "Legacy", "Shipping Policy"].map((label) => {
              const href = label === "Legacy" ? "/about" : "#";
              return (
                <li key={label}>
                  {href === "#" ? (
                    <a href={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="text-white/90 hover:text-white transition-colors text-base font-body">
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="font-display font-bold text-xl mb-4 md:mb-8 text-white">Connect</h3>
          <div className="flex gap-4 mb-8">
            {[
              { Icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
              { Icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
              { Icon: Youtube, href: siteConfig.social.youtube, label: "Youtube" }
            ].map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all font-body text-base"
                aria-label={label}
              >
                <Icon className="h-4 w-4 text-white" />
              </a>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Office Address</span>
              <p className="text-sm font-body leading-relaxed text-white/90">
                3-178, Panjala House, Narimogru,<br />
                Puttur, Dakshina Kannada, Karnataka - 574202
              </p>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Contact</span>
              <a href={`tel:${siteConfig.contact.phone}`} className="text-sm font-body text-white/90 hover:text-white transition-colors">
                {siteConfig.contact.phone}
              </a>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Email</span>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-sm font-body text-white/90 hover:text-white transition-colors">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 md:pt-8 mt-8 md:mt-12 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-4">
        <p className="text-white/80 text-sm font-body order-3 lg:order-1 shrink-0 text-center lg:text-left">
          © {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.
        </p>

        <p className="text-white/80 text-sm font-body order-2 lg:order-2 shrink-0 text-center">
          Designed & Developed by <a href="https://thinkforgeglobal.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A059] hover:text-white font-bold transition-colors">Think Forge Global</a>
        </p>

        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 xl:gap-x-6 gap-y-3 order-1 lg:order-3">
          <div className="flex items-center gap-2 text-white/90">
            <Lock className="h-4 w-4 text-[#C5A059] shrink-0" />
            <span className="text-[10px] xl:text-xs uppercase tracking-widest font-bold whitespace-nowrap">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Award className="h-4 w-4 text-[#C5A059] shrink-0" />
            <span className="text-[10px] xl:text-xs uppercase tracking-widest font-bold whitespace-nowrap">AYUSH Approved</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <BadgeCheck className="h-4 w-4 text-[#C5A059] shrink-0" />
            <span className="text-[10px] xl:text-xs uppercase tracking-widest font-bold whitespace-nowrap">GMP Certified</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default memo(Footer);

