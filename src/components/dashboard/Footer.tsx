export default function Footer() {
    return (
        <footer className="bg-card border-t border-border text-center py-4 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Event Management – Organizer Dashboard
        </footer>
    );
}
